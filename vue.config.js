module.exports = {
    devServer: {
        proxy: {
            "/order": {
                target: "http://localhost:8024",
                // changeOrigin: true,
            },
            "/cart": {
                target: "http://localhost:8023",
                // changeOrigin: true
                // pathRewrite: {
                //
                // }
            }
        }
    }
}
