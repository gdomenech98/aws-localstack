// Generate mqtt client
const context = {};

export const BundleApi = (app) => {
    app.get('/api/v1/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });
}