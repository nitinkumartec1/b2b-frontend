const DESTINATION_IMAGES: Record<string, string> = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  kashmir: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  shimla: 'https://images.unsplash.com/photo-1626244139887-32cc56317bc2?w=800&q=80',
  darjeeling: 'https://images.unsplash.com/photo-1544634076-a9009dfeb612?w=800&q=80',
  sikkim: 'https://images.unsplash.com/photo-1579603058866-26759c87d46c?w=800&q=80',
  ladakh: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  rajasthan: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  jaipur: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=800&q=80',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b230bc18?w=800&q=80',
  agra: 'https://images.unsplash.com/photo-1564507592208-0287afa58b5e?w=800&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  munnar: 'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?w=800&q=80',
  alleppey: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80',
  andaman: 'https://images.unsplash.com/photo-1589394815804-964ce0fa58c4?w=800&q=80',
  lakshadweep: 'https://images.unsplash.com/photo-1601007204439-d3e75e1141fc?w=800&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  thailand: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
  nepal: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
  bhutan: 'https://images.unsplash.com/photo-1574349977051-5fbb79ab2b59?w=800&q=80',
  vietnam: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
  japan: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  switzerland: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
  paris: 'https://images.unsplash.com/photo-1502602881462-8c1ee9ce9b56?w=800&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59693e2498ef?w=800&q=80',
  "new york": 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
};

const CATEGORY_IMAGES: Record<string, string> = {
  honeymoon: 'https://images.unsplash.com/photo-1520483601560-369dffc0e87e?w=800&q=80',
  luxury: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  adventure: 'https://images.unsplash.com/photo-1533692328991-08159ff19fca?w=800&q=80',
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  wildlife: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
  pilgrimage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
  cruise: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&q=80',
  weekend: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
};

const GENERIC_TRAVEL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

export function resolveImage(
  type: 'destination' | 'package' | 'category',
  identifier: string,
  fallback?: string
): string {
  if (!identifier) return fallback || GENERIC_TRAVEL;

  const searchStr = identifier.toLowerCase();

  if (type === 'destination') {
    for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
      if (searchStr.includes(key)) return url;
    }
  }

  if (type === 'category') {
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
      if (searchStr.includes(key)) return url;
    }
  }

  if (type === 'package') {
    // Check destinations first, they are more specific
    for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
      if (searchStr.includes(key)) return url;
    }
    // Check categories next
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
      if (searchStr.includes(key)) return url;
    }
  }

  return fallback || GENERIC_TRAVEL;
}

const DESTINATION_GALLERIES: Record<string, string[]> = {
  goa: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    'https://images.unsplash.com/photo-1599059021750-82716ae2b661?w=800&q=80',
    'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80',
    'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80',
    'https://images.unsplash.com/photo-1526761122248-c31c93f8b299?w=800&q=80'
  ],
  kashmir: [
    'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80',
    'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80',
    'https://images.unsplash.com/photo-1579402925501-c89b7b9d6a36?w=800&q=80',
    'https://images.unsplash.com/photo-1599859556100-2440938ff5d5?w=800&q=80',
    'https://images.unsplash.com/photo-1627582236203-0c4e09fde119?w=800&q=80'
  ],
  dubai: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80',
    'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80',
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80',
    'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800&q=80'
  ],
  bali: [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80'
  ],
  manali: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    'https://images.unsplash.com/photo-1593693397690-362cb9666c6b?w=800&q=80',
    'https://images.unsplash.com/photo-1605649487212-4d4ce7a9d0a1?w=800&q=80',
    'https://images.unsplash.com/photo-1621876547631-50a1df277da2?w=800&q=80',
    'https://images.unsplash.com/photo-1588691505307-e17f259db1f2?w=800&q=80'
  ]
};

export function resolveGallery(identifier: string, fallback?: string[]): string[] {
  if (!identifier) return fallback || [GENERIC_TRAVEL];
  
  const searchStr = identifier.toLowerCase();
  
  for (const [key, gallery] of Object.entries(DESTINATION_GALLERIES)) {
    if (searchStr.includes(key)) {
      return gallery;
    }
  }

  // Fallback to generating a gallery using the single image mapping if a specific gallery isn't defined
  const singleImage = resolveImage('destination', identifier);
  if (singleImage !== GENERIC_TRAVEL) {
    return [singleImage, singleImage, singleImage, singleImage, singleImage];
  }

  return fallback || [GENERIC_TRAVEL];
}
