// ============================================
// GastroCare Backend - Entry Point
// ============================================

require('dotenv').config();

const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const { env } = require('./src/config/env');

const PORT = env.PORT;

async function startServer() {
  try {
    // Test database connection
    await connectDatabase();
    console.log('✅ Database connected successfully');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 GastroCare API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 http://localhost:${PORT}`);
      console.log(`📖 API Base: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
