const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB database
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      if (this.isConnected) {
        console.log('Database already connected');
        return;
      }

      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      // Connect to MongoDB
      await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/artifind', connectionOptions);
      
      this.connection = mongoose.connection;
      this.isConnected = true;

      // Connection event listeners
      this.setupEventListeners();

      console.log('🗄️  Connected to MongoDB successfully');
      console.log(`📍 Database: ${this.connection.name}`);
      console.log(`🌐 Host: ${this.connection.host}:${this.connection.port}`);
      
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  /**
   * Disconnect from database
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log('📴 Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  /**
   * Setup database connection event listeners
   */
  setupEventListeners() {
    // Connection successful
    this.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    // Connection error
    this.connection.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error);
    });

    // Connection disconnected
    this.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Application termination
    process.on('SIGINT', async () => {
      console.log('\n🔄 Closing MongoDB connection due to app termination...');
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database stats
   */
  async getStats() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      const stats = await this.connection.db.stats();
      return {
        database: this.connection.name,
        collections: stats.collections,
        dataSize: this.formatBytes(stats.dataSize),
        storageSize: this.formatBytes(stats.storageSize),
        indexes: stats.indexes,
        indexSize: this.formatBytes(stats.indexSize),
        objects: stats.objects
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check database health
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const status = this.getConnectionStatus();
      const ping = await this.connection.db.admin().ping();
      
      return {
        status: status ? 'healthy' : 'unhealthy',
        connected: status,
        ping: ping.ok === 1,
        readyState: mongoose.connection.readyState,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Create database indexes for better performance
   * @returns {Promise<void>}
   */
  async createIndexes() {
    try {
      // Artisan indexes
      await mongoose.connection.collection('artisans').createIndex({ location: 1 });
      await mongoose.connection.collection('artisans').createIndex({ specialty: 1 });
      await mongoose.connection.collection('artisans').createIndex({ rating: -1 });
      await mongoose.connection.collection('artisans').createIndex({ verified: 1 });

      // Product indexes
      await mongoose.connection.collection('products').createIndex({ category: 1 });
      await mongoose.connection.collection('products').createIndex({ artisanId: 1 });
      await mongoose.connection.collection('products').createIndex({ price: 1 });
      await mongoose.connection.collection('products').createIndex({ tags: 1 });
      await mongoose.connection.collection('products').createIndex({ inStock: 1 });
      await mongoose.connection.collection('products').createIndex({ featured: 1 });
      await mongoose.connection.collection('products').createIndex({ rating: -1 });
      await mongoose.connection.collection('products').createIndex({ createdAt: -1 });

      // Text search indexes
      await mongoose.connection.collection('products').createIndex({ 
        title: 'text', 
        description: 'text', 
        tags: 'text' 
      });
      await mongoose.connection.collection('artisans').createIndex({ 
        name: 'text', 
        description: 'text', 
        specialty: 'text' 
      });

      console.log('📊 Database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }
}

// Create singleton instance
const database = new DatabaseConnection();

module.exports = database;