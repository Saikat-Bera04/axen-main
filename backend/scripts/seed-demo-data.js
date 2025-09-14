const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas directly to avoid compilation issues
const EventSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  stage: { 
    type: String, 
    required: true,
    enum: ['manufacturing', 'farm', 'processing', 'warehouse', 'distribution', 'store', 'customer', 'quality_check', 'packaging', 'shipping']
  },
  submitter: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    temperature: { type: Number },
    notes: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  ipfsHash: { type: String, required: true },
  aiVerified: { 
    type: String, 
    enum: ['verified', 'failed', 'pending'], 
    default: 'pending' 
  },
  transactionHash: { type: String, required: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true, index: true },
  batchId: { type: String, required: true },
  currentStage: {
    type: String,
    enum: ['manufacturing', 'farm', 'processing', 'warehouse', 'distribution', 'store', 'customer', 'quality_check', 'packaging', 'shipping'],
    default: 'farm'
  },
  lastUpdated: { type: Date, default: Date.now },
  verificationStatus: { 
    type: String, 
    enum: ['verified', 'failed', 'pending'], 
    default: 'pending' 
  },
  eventsCount: { type: Number, default: 0 },
  submitter: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

EventSchema.index({ productId: 1, timestamp: 1 });

const EventModel = mongoose.model('Event', EventSchema);
const ProductModel = mongoose.model('Product', ProductSchema);

const demoProducts = [
  {
    productId: 'ORGANIC-APPLE-001',
    batchId: 'BATCH-2024-001',
    currentStage: 'store',
    submitter: 'Green Valley Farms',
    verificationStatus: 'verified',
    eventsCount: 6
  },
  {
    productId: 'PREMIUM-COFFEE-002',
    batchId: 'BATCH-2024-002', 
    currentStage: 'shipping',
    submitter: 'Mountain Coffee Co',
    verificationStatus: 'verified',
    eventsCount: 5
  },
  {
    productId: 'FRESH-SALMON-003',
    batchId: 'BATCH-2024-003',
    currentStage: 'warehouse',
    submitter: 'Ocean Fresh Ltd',
    verificationStatus: 'pending',
    eventsCount: 4
  },
  {
    productId: 'ORGANIC-WHEAT-004',
    batchId: 'BATCH-2024-004',
    currentStage: 'processing',
    submitter: 'Golden Fields Farm',
    verificationStatus: 'verified',
    eventsCount: 3
  },
  {
    productId: 'ARTISAN-CHEESE-005',
    batchId: 'BATCH-2024-005',
    currentStage: 'quality_check',
    submitter: 'Alpine Dairy',
    verificationStatus: 'failed',
    eventsCount: 4
  }
];

const demoEvents = [
  // Organic Apple Events
  {
    productId: 'ORGANIC-APPLE-001',
    stage: 'farm',
    submitter: 'John Smith - Farm Manager',
    timestamp: new Date('2024-01-15T08:00:00Z'),
    metadata: {
      temperature: 18.5,
      notes: 'Apples harvested from organic orchard. Perfect ripeness achieved.',
      location: { lat: 40.7589, lng: -73.9851 }
    },
    ipfsHash: 'QmApple1FarmHash123456789',
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    aiVerified: 'verified'
  },
  {
    productId: 'ORGANIC-APPLE-001',
    stage: 'processing',
    submitter: 'Sarah Johnson - Processing Lead',
    timestamp: new Date('2024-01-16T10:30:00Z'),
    metadata: {
      temperature: 4.2,
      notes: 'Apples washed, sorted, and packaged. Quality grade A+',
      location: { lat: 40.7505, lng: -73.9934 }
    },
    ipfsHash: 'QmApple1ProcessHash123456789',
    transactionHash: '0x2345678901bcdef12345678901bcdef123456789',
    aiVerified: 'verified'
  },
  {
    productId: 'ORGANIC-APPLE-001',
    stage: 'quality_check',
    submitter: 'Mike Chen - QA Inspector',
    timestamp: new Date('2024-01-16T14:15:00Z'),
    metadata: {
      temperature: 4.0,
      notes: 'Passed all quality checks. Organic certification verified.',
      location: { lat: 40.7505, lng: -73.9934 }
    },
    ipfsHash: 'QmApple1QualityHash123456789',
    transactionHash: '0x3456789012cdef123456789012cdef1234567890',
    aiVerified: 'verified'
  },
  {
    productId: 'ORGANIC-APPLE-001',
    stage: 'packaging',
    submitter: 'Lisa Wong - Packaging Supervisor',
    timestamp: new Date('2024-01-17T09:00:00Z'),
    metadata: {
      temperature: 3.8,
      notes: 'Packaged in eco-friendly containers. Ready for distribution.',
      location: { lat: 40.7505, lng: -73.9934 }
    },
    ipfsHash: 'QmApple1PackageHash123456789',
    transactionHash: '0x4567890123def1234567890123def12345678901',
    aiVerified: 'verified'
  },
  {
    productId: 'ORGANIC-APPLE-001',
    stage: 'warehouse',
    submitter: 'David Brown - Warehouse Manager',
    timestamp: new Date('2024-01-18T11:30:00Z'),
    metadata: {
      temperature: 2.5,
      notes: 'Stored in temperature-controlled warehouse. Inventory logged.',
      location: { lat: 40.7282, lng: -74.0776 }
    },
    ipfsHash: 'QmApple1WarehouseHash123456789',
    transactionHash: '0x5678901234ef12345678901234ef123456789012',
    aiVerified: 'verified'
  },
  {
    productId: 'ORGANIC-APPLE-001',
    stage: 'store',
    submitter: 'Emma Davis - Store Manager',
    timestamp: new Date('2024-01-20T08:45:00Z'),
    metadata: {
      temperature: 5.0,
      notes: 'Delivered to Fresh Market. Available for customers.',
      location: { lat: 40.7614, lng: -73.9776 }
    },
    ipfsHash: 'QmApple1StoreHash123456789',
    transactionHash: '0x6789012345f123456789012345f1234567890123',
    aiVerified: 'verified'
  },

  // Premium Coffee Events
  {
    productId: 'PREMIUM-COFFEE-002',
    stage: 'farm',
    submitter: 'Carlos Rodriguez - Coffee Farmer',
    timestamp: new Date('2024-02-01T06:00:00Z'),
    metadata: {
      temperature: 22.0,
      notes: 'Premium arabica beans harvested at optimal altitude. Hand-picked.',
      location: { lat: 14.6349, lng: -90.5069 }
    },
    ipfsHash: 'QmCoffee2FarmHash123456789',
    transactionHash: '0x7890123456f1234567890123456f12345678901234',
    aiVerified: 'verified'
  },
  {
    productId: 'PREMIUM-COFFEE-002',
    stage: 'processing',
    submitter: 'Maria Santos - Processing Manager',
    timestamp: new Date('2024-02-03T14:00:00Z'),
    metadata: {
      temperature: 25.5,
      notes: 'Beans washed and dried using traditional methods. Moisture content optimal.',
      location: { lat: 14.6289, lng: -90.5189 }
    },
    ipfsHash: 'QmCoffee2ProcessHash123456789',
    transactionHash: '0x8901234567f12345678901234567f123456789012',
    aiVerified: 'verified'
  },
  {
    productId: 'PREMIUM-COFFEE-002',
    stage: 'quality_check',
    submitter: 'Roberto Martinez - Quality Expert',
    timestamp: new Date('2024-02-05T10:30:00Z'),
    metadata: {
      temperature: 24.0,
      notes: 'Cupping score: 87/100. Exceptional flavor profile with notes of chocolate and citrus.',
      location: { lat: 14.6289, lng: -90.5189 }
    },
    ipfsHash: 'QmCoffee2QualityHash123456789',
    transactionHash: '0x9012345678f123456789012345678f1234567890',
    aiVerified: 'verified'
  },
  {
    productId: 'PREMIUM-COFFEE-002',
    stage: 'packaging',
    submitter: 'Ana Gutierrez - Export Manager',
    timestamp: new Date('2024-02-07T16:00:00Z'),
    metadata: {
      temperature: 23.8,
      notes: 'Vacuum sealed in specialty bags. Fair trade certification attached.',
      location: { lat: 14.6289, lng: -90.5189 }
    },
    ipfsHash: 'QmCoffee2PackageHash123456789',
    transactionHash: '0xa123456789f0123456789012345678f9012345678',
    aiVerified: 'verified'
  },
  {
    productId: 'PREMIUM-COFFEE-002',
    stage: 'shipping',
    submitter: 'Transport Logistics Inc',
    timestamp: new Date('2024-02-10T12:00:00Z'),
    metadata: {
      temperature: 20.0,
      notes: 'In transit to North American distributors. ETA: 5 days.',
      location: { lat: 25.7617, lng: -80.1918 }
    },
    ipfsHash: 'QmCoffee2ShipHash123456789',
    transactionHash: '0xb23456789f01234567890123456789f0123456789',
    aiVerified: 'pending'
  },

  // Fresh Salmon Events  
  {
    productId: 'FRESH-SALMON-003',
    stage: 'farm',
    submitter: 'Nordic Aquaculture AS',
    timestamp: new Date('2024-02-12T05:30:00Z'),
    metadata: {
      temperature: 8.5,
      notes: 'Atlantic salmon harvested from sustainable fish farm. Weight: 4.2kg',
      location: { lat: 69.6492, lng: 18.9553 }
    },
    ipfsHash: 'QmSalmon3FarmHash123456789',
    transactionHash: '0xc3456789f012345678901234567890f012345678',
    aiVerified: 'verified'
  },
  {
    productId: 'FRESH-SALMON-003',
    stage: 'processing',
    submitter: 'Arctic Processing Ltd',
    timestamp: new Date('2024-02-12T08:45:00Z'),
    metadata: {
      temperature: 2.0,
      notes: 'Fish cleaned, filleted, and flash-frozen. Vacuum packed for freshness.',
      location: { lat: 69.6492, lng: 18.9553 }
    },
    ipfsHash: 'QmSalmon3ProcessHash123456789',
    transactionHash: '0xd456789f0123456789012345678901f0123456789',
    aiVerified: 'verified'
  },
  {
    productId: 'FRESH-SALMON-003',
    stage: 'quality_check',
    submitter: 'Food Safety Inspector',
    timestamp: new Date('2024-02-12T11:00:00Z'),
    metadata: {
      temperature: 1.8,
      notes: 'Passed all safety inspections. Mercury levels well below limits.',
      location: { lat: 69.6492, lng: 18.9553 }
    },
    ipfsHash: 'QmSalmon3QualityHash123456789',
    transactionHash: '0xe56789f012345678901234567890f1012345678',
    aiVerified: 'verified'
  },
  {
    productId: 'FRESH-SALMON-003',
    stage: 'warehouse',
    submitter: 'Cold Storage Facility',
    timestamp: new Date('2024-02-13T14:20:00Z'),
    metadata: {
      temperature: -18.0,
      notes: 'Stored in -18°C freezer. Awaiting distribution orders.',
      location: { lat: 59.9139, lng: 10.7522 }
    },
    ipfsHash: 'QmSalmon3WarehouseHash123456789',
    transactionHash: '0xf6789f01234567890123456789f01012345678901',
    aiVerified: 'pending'
  }
];

async function seedDemoData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supply-chain');
    console.log('📊 Connected to MongoDB for seeding demo data');

    // Clear existing data
    await EventModel.deleteMany({});
    await ProductModel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert demo products
    await ProductModel.insertMany(demoProducts);
    console.log('📦 Inserted demo products');

    // Insert demo events
    await EventModel.insertMany(demoEvents);
    console.log('📝 Inserted demo events');

    console.log('✅ Demo data seeding completed successfully!');
    console.log(`📊 Added ${demoProducts.length} products and ${demoEvents.length} events`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDemoData();
}

module.exports = { seedDemoData, demoProducts, demoEvents };
