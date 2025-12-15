import * as fs from 'fs';
import { DynamoDBClient, ScanCommand, CreateTableCommand, DescribeTableCommand, QueryCommand, UpdateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { STSClient, AssumeRoleWithWebIdentityCommand } from "@aws-sdk/client-sts";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

/*
Define GSIs (example)
   GSIs: [
            { name: 'OrderBy_PARTNER', key: 'PARTNER' },
    ]
*/
const ENABLE_AWS_SANDBOX = process.env?.ENABLE_AWS_SANDBOX;
const AWS_ACCESS_KEY = process.env?.AWS_ACCESS_KEY ?? "";
const AWS_SECRET_KEY = process.env?.AWS_SECRET_KEY ?? "";
const AWS_DYNAMODB_REGION = process.env?.AWS_DYNAMODB_REGION ?? "eu-south-2";
// Implementation of dynamodb class
const dbHandlers: any = {}
const optionsTable = {}

// Prevent stringify Set, convert Set into array
const replacer = (key, value) => {
    // Check if the value is a Set
    if (value instanceof Set) {
        return [...value]; // Convert Set to Array
    }
    // Add other conditions here if needed
    return value;
};

async function getTemporaryCredentials(roleArn, webIdentityTokenPath) {
    console.log('DEV: inside getTemporaryCredentials')
    const stsClient = new STSClient({ region: AWS_DYNAMODB_REGION });
    console.log('DEV: getTemporaryCredentials : stsClient')
    const token = await fs.readFileSync(webIdentityTokenPath, { encoding: 'utf-8' });
    console.log('DEV: getTemporaryCredentials : token: ', token)
    console.log('DEV: getTemporaryCredentials : about to assumeRoleCommand: ')
    const assumeRoleCommand = new AssumeRoleWithWebIdentityCommand({
        RoleArn: roleArn,
        RoleSessionName: 'temporaly-bapis-session',
        WebIdentityToken: token,
        DurationSeconds: 900,  // Duración de las credenciales, en segundos (15 min)
    });
    console.log('DEV: getTemporaryCredentials : assumeRoleCommand: ', assumeRoleCommand)
    const response = await stsClient.send(assumeRoleCommand);
    console.log('DEV: getTemporaryCredentials : recieved response: ', response)
    return response?.Credentials;
}


export class DynamoDB {
    private client;
    tableName;
    options
    constructor(client: DynamoDBDocumentClient, tableName: string, options: any) {
        if (ENABLE_AWS_SANDBOX && (!AWS_ACCESS_KEY || !AWS_SECRET_KEY)) throw (new Error("You must configure AWS_ACCESS_KEY and AWS_SECRET_KEY environments."));
        this.client = client;
        this.tableName = tableName;
        this.options = options;
    }

    async *iterator(options?: { startFrom?: string, filter?: { key: string, value: string }, all?: string }) {
        let items = [];
        let lastEvaluatedKey = options?.startFrom ?? null;
        const all = options?.all; // If enabled returns all items
        const filter = options?.filter ?? null;

        const _scan = async (_lastEvaluatedKey) => {
            const params: any = {
                TableName: this.tableName,
                ExclusiveStartKey: _lastEvaluatedKey, // Use the last evaluated key if it's available
            };
            try {
                return await this.client.send(new ScanCommand(params));
            } catch (error) {
                console.error('Error scanning. ', error);
                throw new Error(error);
            }
        }

        const _query = async (_lastEvaluatedKey, filter: { key: string, value: string }) => {
            const filterKey = filter.key;
            const filterValue = filter.value;
            const params: any = {
                TableName: this.tableName,
                IndexName: `OrderBy_${filterKey}`,     // Name of the GSI
                KeyConditionExpression: `${filterKey} = :value`, // GSI partition key condition
                ExpressionAttributeValues: {
                    ':value': { S: filterValue },  // The value you want to query
                },
                ExclusiveStartKey: _lastEvaluatedKey, // Use the last evaluated key if it's available
            };
            try {
                return await this.client.send(new QueryCommand(params));
            } catch (error) {
                console.error('Error query. ', error);
                throw new Error(error);
            }
        }

        try {
            do {
                let results: any;
                if (filter?.key && filter?.value) {
                    results = await _query(lastEvaluatedKey, filter);
                } else {
                    results = await _scan(lastEvaluatedKey);
                }
                items = items.concat(results.Items.map(item => unmarshall(item))); // Accumulate the items
                lastEvaluatedKey = results.LastEvaluatedKey; // Care only gets last evaluated key as id!
            } while (lastEvaluatedKey && all); // if all its passed repeat this operation until retrieve all db documents
            for (const item of items) {
                yield [item.id, JSON.stringify(item, replacer)]; // Change for stringify? yield [item.id, JSON.stringify(item)];
            }
        } catch (error) {
            console.log("Error scanning table. Error:", error);
        }
    }
    async getPrimaryKey() {
        try {
            const command = new DescribeTableCommand({ TableName: this.tableName });
            const response = await this.client.send(command);
            if (response.Table && response.Table.KeySchema) {
                // KeySchema array will include details of the primary key
                const primaryKey = response.Table.KeySchema.find(key => key.KeyType === 'HASH');
                if (primaryKey) {
                    return primaryKey.AttributeName;
                } else {
                    console.log('No primary key found. Setting id as default');
                    return 'id';
                }
            }
        } catch (e) {
            // Care: primary key is fetched from options, not from the dynamodb table, make sure its configured correctly
            return this.options?.indexes?.primary ?? 'id';
        }

    }

    async get(key: string, options?: any) {

        const primaryKey = await this.getPrimaryKey();
        const getCmd = new GetCommand({
            TableName: this.tableName,
            Key: { [primaryKey]: key },  // query
        });
        const result = await this.client.send(getCmd);
        if (!result.Item) throw new Error("Item not found");
        return JSON.stringify(result.Item, replacer);
    }

    async exists(key: string) {
        try {
            const result = await this.get(key)
            return result ? true : false
        } catch (e: any) {
            return false
        }
    }

    async put(key: string, value: string, options?: any) {
        const putCmd = new PutCommand({
            TableName: this.tableName,
            Item: { ...JSON.parse(value) },
        });
        await this.client.send(putCmd);
    }
    async del(key: string, options?: any) {
        const primaryKey = await this.getPrimaryKey();
        const delCmd = new DeleteCommand({
            TableName: this.tableName,
            Key: { [primaryKey]: key },  // query,
        });
        const result = await this.client.send(delCmd);
    }

    static async getDB(client, tableName): Promise<any> {
        const command = new DescribeTableCommand({ TableName: tableName });
        let table = null;
        try {
            const response = await client.send(command);
            table = response.Table;
        } catch (error) {
            console.error("Error retrieving table info:", error);
        }
        return table
    }

    // Static methods
    static async createDB(client, tableName, primaryKey, options?: { GSIs?: any[] }) {
        if (!tableName) throw new Error("Tablename must be provided");
        if (!primaryKey) throw new Error("PrimaryKey must be provided");
        let db = undefined;
        try {
            db = await DynamoDB.getDB(client, tableName);
            // console.warn('Table not created, already exist.');
        } catch (e) { }
        if (!db) {
            const tableConfig: any = {
                TableName: tableName, // Replace with your desired table name
                AttributeDefinitions: [
                    { AttributeName: primaryKey, AttributeType: 'S' },
                ],
                KeySchema: [
                    { AttributeName: primaryKey, KeyType: 'HASH' },
                ],
                BillingMode: "PAY_PER_REQUEST",
                Tags: [
                    { Key: "app", Value: "bapis" } // needed for servihabitat control
                ]
            }
            if (options?.GSIs?.length) {
                const gsiConfigs = [];
                options.GSIs.forEach(gsi => {
                    if (gsi?.name && gsi?.key) {
                        const config = {
                            IndexName: gsi?.name, // "OrderBy_api"
                            KeySchema: [
                                {
                                    AttributeName: gsi?.key, //"api"
                                    KeyType: "HASH", // 'HASH' indica que 'api' es la clave de partición para el índice
                                },
                            ],
                            Projection: {
                                ProjectionType: "ALL", // Include all atributes of the table to the index
                            }
                        }
                        gsiConfigs.push(config);
                        tableConfig["AttributeDefinitions"].push({ AttributeName: gsi.key, AttributeType: 'S' }) // push new attributes to declare GSIs
                    }
                })
                if (gsiConfigs?.length) tableConfig["GlobalSecondaryIndexes"] = gsiConfigs
            }
            console.log('DEV: tableConfig:: ', JSON.stringify(tableConfig));
            const createTableCmd = new CreateTableCommand(tableConfig);
            try {
                await client.send(createTableCmd);
                await DynamoDB.waitForTableToBeCreated(client, tableName);
                console.log(`Successfuly created table ${tableName}.`);
            } catch (error) {
                console.error("Error creating table:", error);
            }
        }
        else {
            // table is already created, need to update it!
            //  Check and update billing mode to on-demand
            if (db.BillingModeSummary?.BillingMode !== "PAY_PER_REQUEST") {
                // console.log(`Updating table ${tableName} to on-demand billing mode.`);
                const updateTableCmd = new UpdateTableCommand({
                    TableName: tableName,
                    BillingMode: "PAY_PER_REQUEST",
                });
                await client.send(updateTableCmd);
                console.log(`Successfully updated ${tableName} to on-demand billing.`);
            }
            // Check GSIs are already created
            const existingGSIs = db.GlobalSecondaryIndexes?.map((gsi) => gsi.IndexName) || [];
            const existingAttributes = db.AttributeDefinitions?.map((attr) => attr.AttributeName) || [];

            const newGsiConfigs = [];
            const newAttributeDefinitions = [];

            if (options?.GSIs?.length) {
                options.GSIs.forEach(gsi => {
                    if (!existingGSIs.includes(gsi.name)) {
                        // console.log(`Adding new GSI: ${gsi.name}`);
                        if (!existingAttributes.includes(gsi.key)) {
                            // console.log(`Attribute ${gsi.key} not found in table. Adding to AttributeDefinitions.`);
                            newAttributeDefinitions.push({
                                AttributeName: gsi.key,
                                AttributeType: 'S' // Assuming the type is String ('S')
                            });
                        }
                        newGsiConfigs.push({
                            Create: {
                                IndexName: gsi.name,
                                KeySchema: [
                                    {
                                        AttributeName: gsi.key,
                                        KeyType: "HASH",
                                    }
                                ],
                                Projection: {
                                    ProjectionType: "ALL",
                                }
                            }
                        });
                    }
                });
            }

            //  Update table with new GSIs (if any)
            if (newGsiConfigs.length > 0) {
                const updateTableParams = {
                    TableName: tableName,
                    GlobalSecondaryIndexUpdates: newGsiConfigs
                };

                if (newAttributeDefinitions.length > 0) {
                    updateTableParams["AttributeDefinitions"] = [...db.AttributeDefinitions, ...newAttributeDefinitions];
                }

                await client.send(new UpdateTableCommand(updateTableParams));
                // console.log(`Successfully added new GSIs to ${tableName}.`);
            } else {
                console.log(`No new GSIs to add for ${tableName}.`);
            }
        }
    }
    static async waitForTableToBeCreated(client, tableName, timeout = 15000) {
        if (!tableName) throw new Error('tableName must be specified')
        let startTime = Date.now();
        const checkInterval = 2000;
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    const table = await DynamoDB.getDB(client, tableName);
                    if (table.TableStatus === 'ACTIVE') {
                        clearInterval(interval);
                        resolve(true);
                    } else {
                        console.log("Waiting for table to become active...");
                    }
                } catch (error) {
                    console.error("Error retrieving table status:", error);
                    clearInterval(interval);
                    reject(error);
                }

                // Check if the timeout has been reached
                if (Date.now() - startTime > timeout) {
                    console.log("Timeout reached, table may not be active yet.");
                    clearInterval(interval);
                    resolve(false);  // Resolve as false to indicate the table isn't ready yet
                }
            }, checkInterval);
        });
    }
    static async initDB(tableName: string, initialData?: {}, options?: any): Promise<void> {
        const { indexes, dbOptions, ...rest } = options
        optionsTable[tableName] = dbOptions
        console.log('Initializing dynamodb table...', options);
        // funcion helper setup db
        const setupDatabase = async () => {
            console.log(`connecting to dynamodb using table: ${tableName}`);
            // Connect DB
            const db = await this.connect(tableName, { indexes });  // genera un objeto dynamodb:
            // Create DB if not created
            const primaryKey = await db.getPrimaryKey();
            await DynamoDB.createDB(db.client, tableName, primaryKey, optionsTable[tableName]);
            console.log(`connected to dynamodb database at table: ${tableName}`);
            // Asignar a la tabla initialData
            const keys = Object.keys(initialData);
            for (let key of keys) {
                await db.put(key, JSON.stringify(initialData[key]));
                console.log({ key: key, value: initialData[key] }, `Added: ${key} -> ${JSON.stringify(initialData[key])}`);
            }
        }
        try {
            await setupDatabase();
        } catch (error) {
            console.log({ error }, "Error initializing the database");
            throw error;
        }

    }
    static async connect(tableName, options?, config?): Promise<DynamoDB> {
        options = options ? { valueEncoding: 'json', ...options } : { valueEncoding: 'json' }
        // if (!(tableName in dbHandlers)) {
        // TODO getInstance -> we should retrieve new client when STS token expired
        //@ts-ignore
        dbHandlers[tableName] = await this.getInstance(tableName, options, config)
        process.on('SIGINT', async () => {
            console.log('Closing database and terminating process...');
            //@ts-ignore
            await dbHandlers[tableName].close();
            process.exit(0);
        });
        // }

        return dbHandlers[tableName]
    }
    static async getClient(options?) {
        options = options ? { valueEncoding: 'json', ...options } : { valueEncoding: 'json' };
        const clientConfig = {
            region: AWS_DYNAMODB_REGION, // The aws region where is your dynamodb hosted
        };
        if (ENABLE_AWS_SANDBOX) {
            clientConfig["credentials"] = {
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_KEY,
                // sessionToken: "YOUR_SESSION_TOKEN"  // only if needed
            }
        } else {
            console.log('DEV: DB getClient, creating dynamodb client using service account sa-bapis')
            const webIdentityToken = process.env.AWS_WEB_IDENTITY_TOKEN_FILE;  // Token de identidad web proporcionado por EKS
            const roleArn = process.env.AWS_ROLE_ARN;
            console.log('DEV: Credentials:', { roleArn, webIdentityToken, AWS_DYNAMODB_REGION })

            try {
                console.log('DEV: getting temporary credentials')
                const temporaryCredentials = await getTemporaryCredentials(roleArn, webIdentityToken);
                console.log('DEV: temporary credentials', temporaryCredentials)
                clientConfig["credentials"] = {
                    accessKeyId: temporaryCredentials.AccessKeyId,
                    secretAccessKey: temporaryCredentials.SecretAccessKey,
                    sessionToken: temporaryCredentials.SessionToken,
                }
            } catch (e) {
                console.log('[AWS - Error] Error getting temporary credentials. Error: ' + e);
            }
        }
        const dynamodbClient = new DynamoDBClient({ ...clientConfig });
        const client = DynamoDBDocumentClient.from(dynamodbClient);
        return client;
    }

    static async getInstance(tableName, options?) {
        const client = await DynamoDB.getClient(options);
        return new DynamoDB(client, tableName, options)
    }

    async batchWriteItems(tableName, batch) {
        // Retrieve primary key
        const primaryKey = await this.getPrimaryKey();
        // Remove duplicate primary key elements 
        batch = Array.from(new Map(batch.map(item => [item[primaryKey], item])).values());
        // Adapt batch to dynamodb format
        batch = batch.map(item => ({
            PutRequest: { Item: marshall(item) }
        }));
        // console.log('batch: ', batch);
        const params = {
            RequestItems: {
                [tableName]: batch
            }
        };

        let attempt = 0;
        let success = false;
        const MAX_RETRIES = 5;

        while (attempt < MAX_RETRIES && !success) {
            try {
                // console.log('command params: ', params)
                const result = await this.client.send(new BatchWriteItemCommand(params));
                // console.log('res', result)
                success = true; // Exit loop if successful
            } catch (error) {
                if (error.name === 'ProvisionedThroughputExceededException') {
                    const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: wait 2^n seconds
                    console.error(`ProvisionedThroughputExceededException: Retrying batch in ${waitTime / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime)); // Wait before retrying
                } else {
                    console.error(`Error with batch write:`, error);
                    // throw error; // Rethrow non-retryable errors
                }
                attempt++;
            }
        }

        if (!success) {
            console.log(`Failed to write batch after ${MAX_RETRIES} retries.`);
            // throw new Error(`Failed to write batch after ${MAX_RETRIES} retries.`);
        }
    }
}