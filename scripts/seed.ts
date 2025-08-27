import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test user
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin'
    }
  })

  // Image mapping for collections and products
  const imageMap = {
    // Original uploaded images
    galaxy: '/images/products/GALAXY DIAL 2.jpg',
    santos: '/images/products/SANTOS 2.jpg',
    naut: '/images/products/NAUT 2.jpg',
    nautIA: '/images/products/naut IA.png',
    seikoak: '/images/products/seikoak white nonchrono.jpg',
    pinkMod: '/images/products/pink seiko mod 1.png',
    oliveDial: '/images/products/OLIVE DIAL IMAGE.png',
    
    // Generated product images
    roseGoldSunburst: 'https://cdn.abacus.ai/images/62a5204f-6aa9-430d-a113-f10103428218.png',
    pearlWhite: 'https://cdn.abacus.ai/images/08f0bcd8-9500-4d19-8a37-b863167b3ce3.png',
    forestGreen: 'https://cdn.abacus.ai/images/15466084-83d5-4305-9446-5f0dab89723c.png',
    deepTeal: 'https://cdn.abacus.ai/images/80ebe15d-8fa4-4632-9941-465e92832675.png',
    midnightBlack: 'https://cdn.abacus.ai/images/ea12fe82-8336-4233-8ac0-1541bcfd5931.png',
    metallicSilver: 'https://cdn.abacus.ai/images/7be37756-78ef-42d6-92a4-2e430d78a5d7.png',
    arcticWhite: 'https://cdn.abacus.ai/images/a06f1759-1fd3-4a29-aee3-2a31f9d6caa6.png',
    copperBronze: 'https://cdn.abacus.ai/images/a58b0d15-1544-4497-801d-271731e5d488.png',
    champagneGold: 'https://cdn.abacus.ai/images/3b0682cf-87be-44c4-9206-c27585978707.png',
    slateGray: 'https://cdn.abacus.ai/images/956e87ad-7087-4961-9312-2bef05305deb.png',
    burgundy: 'https://cdn.abacus.ai/images/07e9c21f-eb67-4a4b-bff4-9d61e3d4c0f7.png',
    sunburstBlue: 'https://cdn.abacus.ai/images/0f61a2ab-cc12-474f-96be-be5964fd25c3.png',
    emeraldGreen: 'https://cdn.abacus.ai/images/43b7f9d5-bb49-48ae-a3a3-1341e7a8067e.png',
    matteBlack: 'https://cdn.abacus.ai/images/bac8ae7e-1190-4eee-a4e1-c970e4898857.png',
    silverSunburst: 'https://cdn.abacus.ai/images/934cdaca-36b5-4bcb-8f4d-1ade959c7238.png'
  }

  // Create collections
  const seikojust = await prisma.collection.upsert({
    where: { slug: 'seikojust' },
    update: {},
    create: {
      name: 'SeikoJust',
      slug: 'seikojust',
      description: 'Exquisite dress watches refined for discerning collectors seeking luxury and sophistication.',
      image: imageMap.galaxy,
      price: new Decimal('179.99')
    }
  })

  const santos = await prisma.collection.upsert({
    where: { slug: 'santos' },
    update: {},
    create: {
      name: 'Santos',
      slug: 'santos',
      description: 'Aviation-inspired athletic luxury timepieces with premium craftsmanship.',
      image: imageMap.santos,
      price: new Decimal('184.99')
    }
  })

  const seikonaut = await prisma.collection.upsert({
    where: { slug: 'seikonaut' },
    update: {},
    create: {
      name: 'SeikoNaut',
      slug: 'seikonaut',
      description: 'Professional diving tool watches delivering uncompromising luxury and performance.',
      image: imageMap.naut,
      price: new Decimal('189.99')
    }
  })

  const royalSeikoak = await prisma.collection.upsert({
    where: { slug: 'royal-seikoak' },
    update: {},
    create: {
      name: 'Royal SeikOak',
      slug: 'royal-seikoak',
      description: 'Royal Oak inspired integrated bracelet luxury masterpieces for the discerning collector.',
      image: imageMap.seikoak,
      price: new Decimal('189.99')
    }
  })

  // Helper function to convert price range to single price
  const convertPrice = (priceRange: string): Decimal => {
    // Extract numbers from "$2225-$5659" format and use the lower price
    const match = priceRange.match(/\$(\d+)-\$(\d+)/)
    if (match) {
      const lower = parseInt(match[1])
      // Convert from $ to £ (roughly divide by 1.3) and round to match our pricing
      const gbpPrice = Math.round((lower / 1.3) * 0.1) // Scale down to our price range
      return new Decimal(Math.max(174.99, Math.min(189.99, 174.99 + (gbpPrice % 15))))
    }
    return new Decimal('179.99')
  }

  // Create products for SeikoJust collection
  const seikoJustProducts = [
    {
      name: 'SeikoJust Rose Edition',
      slug: 'seikojust-rose-edition',
      description: 'Exquisite SeikoJust Rose Edition showcases rose gold sunburst dial perfection in brushed steel. This dress watch refined luxury masterpiece features Seiko Spring Drive 9R65 movement with 42mm case.',
      price: new Decimal('179.99'),
      image: imageMap.roseGoldSunburst,
      dialColor: 'Rose Gold Sunburst',
      caseSize: '42mm',
      caseMaterial: 'Brushed Steel',
      movement: 'Seiko Spring Drive 9R65',
      waterResistance: '50m',
      braceletType: 'Milanese Mesh',
      isFeatured: true
    },
    {
      name: 'SeikoJust Pearl Edition',
      slug: 'seikojust-pearl-edition',
      description: 'Exquisite SeikoJust Pearl Edition showcases pearl white dial perfection in titanium grade 2. This dress watch refined luxury masterpiece features Seiko 6R15 Premium movement with 42mm case.',
      price: new Decimal('174.99'),
      image: imageMap.pearlWhite,
      dialColor: 'Pearl White',
      caseSize: '42mm',
      caseMaterial: 'Titanium Grade 2',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'NATO Canvas',
      isFeatured: true
    },
    {
      name: 'SeikoJust Galaxy Edition',
      slug: 'seikojust-galaxy-edition',
      description: 'Stunning galaxy dial meets precision engineering in this limited edition SeikoJust timepiece.',
      price: new Decimal('189.99'),
      image: imageMap.galaxy,
      dialColor: 'Galaxy Blue',
      caseSize: '40mm',
      caseMaterial: 'Stainless Steel',
      movement: 'Seiko NH35A Modified',
      waterResistance: '100m',
      braceletType: 'Steel Bracelet',
      isFeatured: true
    },
    {
      name: 'SeikoJust Forest Edition',
      slug: 'seikojust-forest-edition',
      description: 'Forest green dial perfection with stainless steel 316L case and ceramic links.',
      price: new Decimal('179.99'),
      image: imageMap.forestGreen,
      dialColor: 'Forest Green',
      caseSize: '42mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'Ceramic Links'
    },
    {
      name: 'SeikoJust Midnight Edition',
      slug: 'seikojust-midnight-edition',
      description: 'Midnight black Roman dial with ceramic insert and polished steel bezel.',
      price: new Decimal('184.99'),
      image: imageMap.midnightBlack,
      dialColor: 'Midnight Black Roman',
      caseSize: '38mm',
      caseMaterial: 'Ceramic Insert',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'Ceramic Links'
    },
    {
      name: 'SeikoJust Arctic Edition',
      slug: 'seikojust-arctic-edition',
      description: 'Arctic white dial with brushed steel case and diamond-set bezel.',
      price: new Decimal('189.99'),
      image: imageMap.arcticWhite,
      dialColor: 'Arctic White',
      caseSize: '38mm',
      caseMaterial: 'Brushed Steel',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'Steel Bracelet'
    },
    {
      name: 'SeikoJust Olive Edition',
      slug: 'seikojust-olive-edition',
      description: 'Distinctive olive dial in premium stainless steel with exceptional craftsmanship.',
      price: new Decimal('179.99'),
      image: imageMap.oliveDial,
      dialColor: 'Olive Green',
      caseSize: '40mm',
      caseMaterial: 'Stainless Steel',
      movement: 'Seiko NH35A',
      waterResistance: '100m',
      braceletType: 'Steel Bracelet'
    },
    {
      name: 'SeikoJust Copper Edition',
      slug: 'seikojust-copper-edition',
      description: 'Copper bronze dial with titanium grade 2 case and rose gold fluted bezel.',
      price: new Decimal('184.99'),
      image: imageMap.copperBronze,
      dialColor: 'Copper Bronze',
      caseSize: '42mm',
      caseMaterial: 'Titanium Grade 2',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'Ceramic Links'
    }
  ]

  // Create products for Santos collection
  const santosProducts = [
    {
      name: 'Santos Champagne Edition',
      slug: 'santos-champagne-edition',
      description: 'Aviation-inspired luxury with champagne gold dial and brushed steel case.',
      price: new Decimal('184.99'),
      image: imageMap.champagneGold,
      dialColor: 'Champagne Gold',
      caseSize: '44mm',
      caseMaterial: 'Brushed Steel',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'Rubber Sports Strap',
      isFeatured: true
    },
    {
      name: 'Santos Classic',
      slug: 'santos-classic',
      description: 'The quintessential Santos timepiece with premium finishing and luxury details.',
      price: new Decimal('189.99'),
      image: imageMap.santos,
      dialColor: 'Silver',
      caseSize: '40mm',
      caseMaterial: 'Stainless Steel',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '200m',
      braceletType: 'Steel Bracelet',
      isFeatured: true
    },
    {
      name: 'Santos Slate Edition',
      slug: 'santos-slate-edition',
      description: 'Slate gray dial with stainless steel 316L and ceramic unidirectional bezel.',
      price: new Decimal('179.99'),
      image: imageMap.slateGray,
      dialColor: 'Slate Gray',
      caseSize: '42mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko NH35A Modified',
      waterResistance: '100m',
      braceletType: 'Steel Bracelet'
    },
    {
      name: 'Santos Burgundy Edition',
      slug: 'santos-burgundy-edition',
      description: 'Burgundy gradient dial with rose gold fluted bezel and NATO canvas.',
      price: new Decimal('174.99'),
      image: imageMap.burgundy,
      dialColor: 'Burgundy Gradient',
      caseSize: '38mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'NATO Canvas'
    },
    {
      name: 'Santos Galaxy Edition',
      slug: 'santos-galaxy-edition',
      description: 'Galaxy blue dial with black DLC coating and ceramic unidirectional bezel.',
      price: new Decimal('184.99'),
      image: imageMap.sunburstBlue,
      dialColor: 'Galaxy Blue',
      caseSize: '41mm',
      caseMaterial: 'Black DLC Coating',
      movement: 'Seiko 4R36 Enhanced',
      waterResistance: '200m',
      braceletType: 'Milanese Mesh'
    }
  ]

  // Create products for SeikoNaut collection
  const seikoNautProducts = [
    {
      name: 'SeikoNaut Professional',
      slug: 'seikonaut-professional',
      description: 'Professional diving tool watch with uncompromising luxury and performance.',
      price: new Decimal('189.99'),
      image: imageMap.naut,
      dialColor: 'Black',
      caseSize: '42mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '300m',
      braceletType: 'Steel Bracelet',
      isFeatured: true
    },
    {
      name: 'SeikoNaut IA Edition',
      slug: 'seikonaut-ia-edition',
      description: 'Special edition diving watch with enhanced water resistance and premium finishing.',
      price: new Decimal('189.99'),
      image: imageMap.nautIA,
      dialColor: 'Deep Blue',
      caseSize: '42mm',
      caseMaterial: 'Titanium',
      movement: 'Seiko Spring Drive',
      waterResistance: '500m',
      braceletType: 'Titanium Bracelet',
      isFeatured: true
    },
    {
      name: 'SeikoNaut Metallic Edition',
      slug: 'seikonaut-metallic-edition',
      description: 'Metallic silver dial with rose gold fluted bezel and ceramic links.',
      price: new Decimal('179.99'),
      image: imageMap.metallicSilver,
      dialColor: 'Metallic Silver',
      caseSize: '40mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '1000m',
      braceletType: 'Ceramic Links'
    },
    {
      name: 'SeikoNaut Forest Edition',
      slug: 'seikonaut-forest-edition',
      description: 'Forest green dial with rose gold PVD and sapphire crystal bezel.',
      price: new Decimal('184.99'),
      image: imageMap.emeraldGreen,
      dialColor: 'Forest Green',
      caseSize: '40mm',
      caseMaterial: 'Rose Gold PVD',
      movement: 'Seiko Spring Drive 9R65',
      waterResistance: '1000m',
      braceletType: 'NATO Canvas'
    },
    {
      name: 'SeikoNaut Midnight Edition',
      slug: 'seikonaut-midnight-edition',
      description: 'Midnight black Roman dial with rose gold PVD and ceramic bezel.',
      price: new Decimal('189.99'),
      image: imageMap.matteBlack,
      dialColor: 'Midnight Black Roman',
      caseSize: '40mm',
      caseMaterial: 'Rose Gold PVD',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '300m',
      braceletType: 'Ceramic Links'
    }
  ]

  // Create products for Royal SeikOak collection
  const royalSeikOakProducts = [
    {
      name: 'Royal SeikOak Classic',
      slug: 'royal-seikoak-classic',
      description: 'Royal Oak inspired integrated bracelet luxury masterpiece for discerning collectors.',
      price: new Decimal('189.99'),
      image: imageMap.seikoak,
      dialColor: 'White',
      caseSize: '41mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '100m',
      braceletType: 'Integrated Steel Bracelet',
      isFeatured: true
    },
    {
      name: 'Royal SeikOak Pearl Edition',
      slug: 'royal-seikoak-pearl-edition',
      description: 'Pearl white dial with ceramic unidirectional bezel and Italian leather strap.',
      price: new Decimal('184.99'),
      image: imageMap.silverSunburst,
      dialColor: 'Pearl White',
      caseSize: '42mm',
      caseMaterial: 'Stainless Steel 316L',
      movement: 'Seiko 6R15 Premium',
      waterResistance: '200m',
      braceletType: 'Italian Leather Strap'
    },
    {
      name: 'Royal SeikOak Pink Edition',
      slug: 'royal-seikoak-pink-edition',
      description: 'Exclusive pink modified Seiko with luxury finishing and premium materials.',
      price: new Decimal('189.99'),
      image: imageMap.pinkMod,
      dialColor: 'Pink',
      caseSize: '38mm',
      caseMaterial: 'Rose Gold PVD',
      movement: 'Seiko NH35A Modified',
      waterResistance: '100m',
      braceletType: 'Steel Bracelet'
    }
  ]

  // Create all products
  const allProducts = [
    ...seikoJustProducts.map(p => ({ ...p, collectionId: seikojust.id })),
    ...santosProducts.map(p => ({ ...p, collectionId: santos.id })),
    ...seikoNautProducts.map(p => ({ ...p, collectionId: seikonaut.id })),
    ...royalSeikOakProducts.map(p => ({ ...p, collectionId: royalSeikoak.id }))
  ]

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i]
    const sku = `CK-${String(i + 1).padStart(3, '0')}-${product.slug.substring(0, 3).toUpperCase()}`
    
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.description.substring(0, 150) + '...',
        price: product.price,
        sku: sku,
        featuredImage: product.image,
        images: [product.image],
        dialColor: product.dialColor,
        caseSize: product.caseSize,
        caseMaterial: product.caseMaterial,
        movement: product.movement,
        waterResistance: product.waterResistance,
        braceletType: product.braceletType,
        weight: '145g',
        features: ['Sapphire Crystal', 'Water Resistant', 'Precision Movement', 'Premium Finishing'],
        specifications: {
          movement: product.movement,
          caseSize: product.caseSize,
          caseMaterial: product.caseMaterial,
          dialColor: product.dialColor,
          bracelet: product.braceletType,
          waterResistance: product.waterResistance,
          warranty: '2 Years International'
        },
        collectionId: product.collectionId,
        isFeatured: product.isFeatured || false,
        isNewArrival: false,
        stockQuantity: 5,
        inStock: true
      }
    })
  }

  // Sample blog posts
  const blogPosts = [
    {
      title: 'The Art of Watch Modification: Crafting Perfection',
      slug: 'art-of-watch-modification',
      excerpt: 'Discover the meticulous process behind our custom Seiko modifications and what makes each timepiece unique.',
      content: 'At Crafted Kettles, we believe that true luxury lies in the details. Each watch in our collection undergoes a meticulous modification process...',
      featuredImage: imageMap.roseGoldSunburst,
      published: true,
      tags: ['craftsmanship', 'modification', 'luxury']
    },
    {
      title: 'Why Seiko Movements Are Perfect for Luxury Modifications',
      slug: 'seiko-movements-luxury-modifications',
      excerpt: 'Understanding the superior engineering that makes Seiko the perfect foundation for our luxury timepieces.',
      content: 'Seiko has been at the forefront of horological innovation for decades. Their movements provide the perfect foundation...',
      featuredImage: imageMap.santos,
      published: true,
      tags: ['seiko', 'movements', 'engineering']
    }
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post
    })
  }

  console.log('✅ Seeding completed successfully!')
  console.log(`Created ${allProducts.length} products across 4 collections`)
  console.log('Collections: SeikoJust, Santos, SeikoNaut, Royal SeikOak')
  console.log('Test user: john@doe.com / johndoe123')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
