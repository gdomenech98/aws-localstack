const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');


const handlebars = {
    deploy: process.env.DEPLOY === 'true',
    dev: process.env.PROD !== 'true',
}

console.log('HANDLEBARS:::: ', handlebars);

const readAndProcessTemplates = (dir) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            readAndProcessTemplates(filePath); // Recursively process subdirectories
        } else {
            const templateContent = fs.readFileSync(filePath, 'utf8');
            const template = Handlebars.compile(templateContent);
            const config = template(handlebars); // load variables values to template

            const outputPath = path.join(__dirname, 'out', path.relative(path.join(__dirname, 'templates'), filePath.split('.tpl')[0]));
            const outputDir = path.dirname(outputPath);

            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(outputPath, config);
            console.log(`Config file generated: ${outputPath}`);
        }
    });
};

readAndProcessTemplates(path.join(__dirname, 'templates'));