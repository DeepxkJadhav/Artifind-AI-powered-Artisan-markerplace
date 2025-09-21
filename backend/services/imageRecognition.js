const vision = require('@google-cloud/vision');

class ImageRecognitionService {
  constructor() {
    // Initialize Google Vision client with service account key
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_VISION_KEY_PATH, // Path to service account JSON
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
    
    this.isEnabled = !!(process.env.GOOGLE_VISION_KEY_PATH && process.env.GOOGLE_CLOUD_PROJECT_ID);
  }

  /**
   * Analyze image for product categorization
   * @param {string} imagePath - Path to the image file
   * @returns {Object} Analysis results
   */
  async analyzeProduct(imagePath) {
    if (!this.isEnabled) {
      return this.getMockAnalysis();
    }

    try {
      const [result] = await this.client.labelDetection(imagePath);
      const labels = result.labelAnnotations || [];
      
      // Extract colors
      const [colorResult] = await this.client.imageProperties(imagePath);
      const colors = this.extractDominantColors(colorResult.imagePropertiesAnnotation?.dominantColors);
      
      // Categorize based on detected labels
      const categorization = this.categorizeProduct(labels);
      
      // Extract materials based on labels
      const materials = this.extractMaterials(labels);
      
      return {
        categories: categorization.categories,
        primaryCategory: categorization.primary,
        confidence: categorization.confidence,
        materials: materials,
        colors: colors,
        style: this.determineStyle(labels),
        labels: labels.map(label => ({
          description: label.description,
          score: label.score
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Google Vision API error:', error);
      throw new Error('Failed to analyze image with Google Vision API');
    }
  }

  /**
   * Detect text in images (for reading labels, signatures, etc.)
   * @param {string} imagePath - Path to the image file
   * @returns {Array} Detected text
   */
  async detectText(imagePath) {
    if (!this.isEnabled) {
      return ['Handcrafted by Local Artisan'];
    }

    try {
      const [result] = await this.client.textDetection(imagePath);
      const detections = result.textAnnotations || [];
      
      return detections.map(text => ({
        description: text.description,
        confidence: text.confidence || 0,
        boundingPoly: text.boundingPoly
      }));
    } catch (error) {
      console.error('Text detection error:', error);
      return [];
    }
  }

  /**
   * Categorize product based on detected labels
   * @param {Array} labels - Google Vision labels
   * @returns {Object} Categorization results
   */
  categorizeProduct(labels) {
    const categoryMappings = {
      'Pottery': ['pottery', 'ceramic', 'clay', 'vase', 'bowl', 'mug', 'plate'],
      'Furniture': ['furniture', 'table', 'chair', 'cabinet', 'shelf', 'desk', 'bench'],
      'Jewelry': ['jewelry', 'necklace', 'bracelet', 'ring', 'earrings', 'pendant'],
      'Textiles': ['textile', 'fabric', 'clothing', 'blanket', 'pillow', 'rug', 'tapestry'],
      'Woodwork': ['wood', 'wooden', 'carving', 'sculpture', 'lumber'],
      'Metalwork': ['metal', 'iron', 'bronze', 'copper', 'steel', 'aluminum'],
      'Glasswork': ['glass', 'crystal', 'transparent', 'clear'],
      'Art': ['art', 'painting', 'drawing', 'canvas', 'frame']
    };

    const scores = {};
    let maxScore = 0;
    let primaryCategory = 'Crafts';

    // Score each category based on label matches
    for (const [category, keywords] of Object.entries(categoryMappings)) {
      scores[category] = 0;
      
      labels.forEach(label => {
        const description = label.description.toLowerCase();
        keywords.forEach(keyword => {
          if (description.includes(keyword)) {
            scores[category] += label.score;
          }
        });
      });

      if (scores[category] > maxScore) {
        maxScore = scores[category];
        primaryCategory = category;
      }
    }

    const sortedCategories = Object.entries(scores)
      .filter(([_, score]) => score > 0.1)
      .sort((a, b) => b[1] - a[1])
      .map(([category, _]) => category);

    return {
      primary: primaryCategory,
      categories: sortedCategories.slice(0, 3),
      confidence: maxScore,
      scores: scores
    };
  }

  /**
   * Extract materials from detected labels
   * @param {Array} labels - Google Vision labels
   * @returns {Array} Detected materials
   */
  extractMaterials(labels) {
    const materialKeywords = [
      'wood', 'wooden', 'oak', 'pine', 'cedar', 'bamboo',
      'clay', 'ceramic', 'porcelain', 'earthenware',
      'metal', 'iron', 'steel', 'copper', 'bronze', 'silver', 'gold',
      'glass', 'crystal',
      'fabric', 'cotton', 'wool', 'silk', 'linen',
      'leather', 'plastic', 'stone', 'marble', 'granite'
    ];

    const detectedMaterials = [];
    
    labels.forEach(label => {
      const description = label.description.toLowerCase();
      materialKeywords.forEach(material => {
        if (description.includes(material) && !detectedMaterials.includes(material)) {
          detectedMaterials.push(material);
        }
      });
    });

    return detectedMaterials;
  }

  /**
   * Determine artistic style from labels
   * @param {Array} labels - Google Vision labels
   * @returns {string} Detected style
   */
  determineStyle(labels) {
    const styleKeywords = {
      'traditional': ['traditional', 'classic', 'vintage', 'antique'],
      'modern': ['modern', 'contemporary', 'minimalist', 'sleek'],
      'rustic': ['rustic', 'country', 'farmhouse', 'weathered'],
      'artistic': ['artistic', 'creative', 'unique', 'decorative'],
      'industrial': ['industrial', 'metal', 'steel', 'concrete']
    };

    for (const [style, keywords] of Object.entries(styleKeywords)) {
      for (const label of labels) {
        const description = label.description.toLowerCase();
        if (keywords.some(keyword => description.includes(keyword))) {
          return style;
        }
      }
    }

    return 'handcrafted';
  }

  /**
   * Extract dominant colors from image analysis
   * @param {Object} dominantColors - Google Vision color data
   * @returns {Array} Color names and values
   */
  extractDominantColors(dominantColors) {
    if (!dominantColors?.colors) return [];

    return dominantColors.colors.slice(0, 5).map(colorInfo => {
      const color = colorInfo.color;
      return {
        red: Math.round(color.red || 0),
        green: Math.round(color.green || 0),
        blue: Math.round(color.blue || 0),
        score: colorInfo.score,
        pixelFraction: colorInfo.pixelFraction
      };
    });
  }

  /**
   * Get mock analysis for development/testing
   * @returns {Object} Mock analysis data
   */
  getMockAnalysis() {
    return {
      categories: ['Pottery', 'Ceramics', 'Handcrafted'],
      primaryCategory: 'Pottery',
      confidence: 0.87,
      materials: ['clay', 'glaze', 'ceramic'],
      colors: [
        { red: 139, green: 69, blue: 19, score: 0.32, pixelFraction: 0.28 },
        { red: 160, green: 82, blue: 45, score: 0.24, pixelFraction: 0.19 }
      ],
      style: 'traditional',
      labels: [
        { description: 'Pottery', score: 0.95 },
        { description: 'Ceramic', score: 0.88 },
        { description: 'Handcraft', score: 0.76 }
      ],
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new ImageRecognitionService();