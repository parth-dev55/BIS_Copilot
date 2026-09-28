export interface IndianStandardItem {
  id: string;
  isNumber: string;
  title: string;
  productName: string;
  category: 'Electronics & IT' | 'Food & Water' | 'Safety & PPE' | 'Electrical Appliances' | 'Construction & Metals' | 'Precious Metals & Jewellery' | 'Consumer & Toys' | 'Automotive & Transport';
  scheme: 'Scheme-I (ISI Mark)' | 'Scheme-II (CRS)' | 'Scheme-IV (Hallmarking)' | 'Scheme-X' | 'Voluntary';
  mandatoryQco: boolean;
  qcoTitle?: string;
  qcoMinistry?: string;
  descriptionInPlainLanguage: string;
  keyTestingParameters: string[];
  recommendedLabs: string[];
  officialDocUrl: string;
  portalUrl: string;
}

export interface CertificationSchemeWorkflow {
  id: string;
  schemeCode: string;
  name: string;
  targetAudience: string;
  applicableProducts: string;
  portalUrl: string;
  estimatedTimeline: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    actionRequired: string;
    documentsNeeded: string[];
  }[];
  keyFees: string;
  commonPitfalls: string[];
}

export interface BisTestingLab {
  id: string;
  name: string;
  type: 'Central Laboratory' | 'Regional Laboratory' | 'Branch Laboratory' | 'Recognized NABL Partner';
  region: 'North' | 'West' | 'South' | 'East' | 'Central';
  address: string;
  contactEmail: string;
  phone: string;
  disciplines: ('Chemical' | 'Electrical' | 'Mechanical' | 'Microbiology' | 'Metallurgy' | 'Electronics' | 'Textiles')[];
  keyProductScopes: string[];
}

export interface GoldHallmarkPurityGrade {
  karat: string;
  fineness: number;
  markingSymbol: string;
  goldPercentage: string;
  typicalUses: string;
  description: string;
}

export const GOLD_PURITY_GRADES: GoldHallmarkPurityGrade[] = [
  {
    karat: '24K',
    fineness: 999,
    markingSymbol: '24K999',
    goldPercentage: '99.9%',
    typicalUses: 'Gold bullion, investment coins, certified minted bars',
    description: 'Highest purity gold available, soft and lustrous, rarely used for intricate gemstone jewellery.'
  },
  {
    karat: '22K',
    fineness: 916,
    markingSymbol: '22K916',
    goldPercentage: '91.6%',
    typicalUses: 'Traditional Indian wedding jewellery, chains, bangles, necklaces',
    description: 'Most popular gold grade across India. Alloyed with copper/silver for strength while retaining radiant gold luster.'
  },
  {
    karat: '20K',
    fineness: 833,
    markingSymbol: '20K833',
    goldPercentage: '83.3%',
    typicalUses: 'Durable daily wear ornaments, rings, bracelets',
    description: 'Stronger and more scratch resistant than 22K while retaining high gold fineness.'
  },
  {
    karat: '18K',
    fineness: 750,
    markingSymbol: '18K750',
    goldPercentage: '75.0%',
    typicalUses: 'Diamond studded jewellery, modern luxury watches, cocktail rings',
    description: 'Ideal hardness to securely hold diamonds and precious gemstones in place without loosening prongs.'
  },
  {
    karat: '14K',
    fineness: 585,
    markingSymbol: '14K585',
    goldPercentage: '58.5%',
    typicalUses: 'Contemporary lightweight office jewellery, gemstone studs',
    description: 'High tensile durability and budget-friendly gold ratio, popular in modern minimalist collections.'
  },
  {
    karat: '9K',
    fineness: 375,
    markingSymbol: '9K375',
    goldPercentage: '37.5%',
    typicalUses: 'Budget jewellery, fashion accessories',
    description: 'Approved under revised BIS standards to make hallmarked gold accessible for everyday fashion jewellery.'
  }
];

export const MANDATORY_HALLMARK_MARKS = [
  {
    id: 'bis-logo',
    title: '1. BIS Standard Mark (Triangle Logo)',
    description: 'The triangular logo confirms that the metal has been tested and certified according to Bureau of Indian Standards specifications (IS 1417).',
    significance: 'Ensures the jeweller is registered and compliant with government quality standards.'
  },
  {
    id: 'purity-mark',
    title: '2. Purity Grade & Fineness',
    description: 'Indicates exact karat and gold purity (e.g. 22K916 for 22 Karat 91.6% purity or 18K750 for 18 Karat).',
    significance: 'Guarantees you pay for the exact quantity of real gold metal in the piece.'
  },
  {
    id: 'huid-mark',
    title: '3. 6-Digit Alphanumeric HUID',
    description: 'Hallmark Unique Identification (e.g., A1B2C3). Laser marked on every individual piece by a BIS-recognized Assaying & Hallmarking Centre (AHC).',
    significance: 'Provides end-to-end traceability. Can be verified in seconds on the official BIS Care mobile app.'
  }
];

export const INDIAN_STANDARDS_DATABASE: IndianStandardItem[] = [
  {
    id: 'is-10500',
    isNumber: 'IS 10500:2012',
    title: 'Drinking Water — Specification (Second Revision)',
    productName: 'Packaged Drinking Water & Municipal Potable Water',
    category: 'Food & Water',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Packaged Drinking Water Quality Control Order',
    qcoMinistry: 'Ministry of Consumer Affairs & FSSAI Mandate',
    descriptionInPlainLanguage: 'Defines the mandatory safety, hygiene, physical, chemical, and microbiological limits for safe drinking water in India.',
    keyTestingParameters: ['Microbiological safety (E. coli, Faecal Streptococci)', 'Toxic heavy metals (Lead, Mercury, Cadmium, Arsenic)', 'Pesticide residue limits (individual & total)', 'Total Dissolved Solids (TDS), pH, and turbidity'],
    recommendedLabs: ['BIS Central Laboratory Sahibabad', 'Northern Regional Lab Mohali', 'Western Regional Lab Mumbai', 'Shri Ram Institute for Industrial Research'],
    officialDocUrl: 'https://standardsbis.bsbedge.com/BIS_SearchStandard.aspx?Standard_Number=10500',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-14543',
    isNumber: 'IS 14543:2016',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water)',
    productName: 'Bottled Drinking Water & Water Jars (20 Litre Dispenser Cans)',
    category: 'Food & Water',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Packaged Drinking Water Mandatory Certification Scheme',
    qcoMinistry: 'Ministry of Consumer Affairs, Food and Public Distribution',
    descriptionInPlainLanguage: 'Compulsory standard for every commercial water bottling plant, RO water bottling brand, and 20L water jar manufacturer in India. Selling without ISI mark is a criminal offense.',
    keyTestingParameters: ['Reverse Osmosis / UV purification verification', 'Aerobic microbial count', 'Heavy metal limits', 'Bottle virgin food-grade plastic compliance (IS 15410)'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'Southern Regional Lab Chennai', 'NABL Accredited Food Labs'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-1417',
    isNumber: 'IS 1417:2016',
    title: 'Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking',
    productName: 'Gold Jewellery, Ornaments, Coins and Artefacts',
    category: 'Precious Metals & Jewellery',
    scheme: 'Scheme-IV (Hallmarking)',
    mandatoryQco: true,
    qcoTitle: 'Hallmarking of Gold Jewellery and Gold Artefacts Order',
    qcoMinistry: 'Department of Consumer Affairs',
    descriptionInPlainLanguage: 'Specifies the mandatory fineness grades (14K, 18K, 20K, 22K, 23K, 24K) and 3-mark hallmark symbols including 6-digit HUID for all gold jewellery sold in notified districts across India.',
    keyTestingParameters: ['Fire assaying testing method', 'X-ray Fluorescence (XRF) spectrometry', 'Purity tolerance verification (zero negative tolerance for gold fineness)', 'HUID laser marking integrity'],
    recommendedLabs: ['Recognized Assaying & Hallmarking Centres (AHCs) across India', 'Central Hallmarking Cell, New Delhi'],
    officialDocUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/hallmarking/overview',
    portalUrl: 'https://www.manakonline.in/MANAK/hallmarkingHome'
  },
  {
    id: 'is-9873',
    isNumber: 'IS 9873 (Parts 1 to 9)',
    title: 'Safety of Toys — Mechanical, Chemical, Flammability and Electric Safety',
    productName: 'Children Toys (Plastic, Plush, Wooden, Electric & Battery-Operated)',
    category: 'Consumer & Toys',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Toys (Quality Control) Order',
    qcoMinistry: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    descriptionInPlainLanguage: 'Mandatory safety standard for all toys meant for children under 14 years. Strictly prohibits sharp edges, small choking hazards, toxic phthalates, and lead pigments.',
    keyTestingParameters: ['Migration of certain heavy metals (Lead, Cadmium, Arsenic)', 'Mechanical drop test & sharp edge hazard analysis', 'Flammability of soft plush textiles', 'Phthalates concentration in vinyl plastics (< 0.1%)'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'Western Regional Lab Mumbai', 'TUV Rheinland / Intertek Recognized Labs'],
    officialDocUrl: 'https://bis.gov.in/index.php/qco-toys/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-4151',
    isNumber: 'IS 4151:2015',
    title: 'Protective Helmets for Two Wheeler Riders — Specification',
    productName: 'Motorcycle & Two-Wheeler Helmets',
    category: 'Safety & PPE',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Helmet for Two Wheeler Riders (Quality Control) Order',
    qcoMinistry: 'Ministry of Road Transport and Highways (MoRTH)',
    descriptionInPlainLanguage: 'Compulsory standard for all two-wheeler helmets sold or imported in India. Selling non-ISI helmets on roads or e-commerce is banned under the Motor Vehicles Act.',
    keyTestingParameters: ['Impact absorption test at high/low temperatures', 'Dynamic retention test of chin strap', 'Visor optical clarity, scratch resistance & UV permeability', 'Weight limit (maximum 1.2 kg to prevent neck fatigue)'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'Northern Regional Lab Mohali', 'ARAI Pune', 'ICAT Manesar'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-13252',
    isNumber: 'IS 13252 (Part 1):2010',
    title: 'Information Technology Equipment — Safety (General Requirements)',
    productName: 'Laptops, Tablets, Smart Phones, POS Terminals, Desktop Computers',
    category: 'Electronics & IT',
    scheme: 'Scheme-II (CRS)',
    mandatoryQco: true,
    qcoTitle: 'Electronics and Information Technology Goods (Compulsory Registration) Order (CRO)',
    qcoMinistry: 'Ministry of Electronics and Information Technology (MeitY)',
    descriptionInPlainLanguage: 'Mandatory standard under CRS (Compulsory Registration Scheme) ensuring IT goods are protected against electrical shocks, fire hazards, and excessive heating.',
    keyTestingParameters: ['Electric insulation & creepage distances', 'Temperature rise under normal & fault conditions', 'Mechanical enclosure strength & drop test', 'Flame retardant enclosure rating (UL 94 equivalent)'],
    recommendedLabs: ['SAMEER Mumbai/Chennai', 'ERTL (North) New Delhi', 'UL India', 'TUV SUD India'],
    officialDocUrl: 'https://www.crsbis.in/BIS/products.do',
    portalUrl: 'https://www.crsbis.in'
  },
  {
    id: 'is-16046',
    isNumber: 'IS 16046 (Part 1 & 2):2018',
    title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Lithium Systems)',
    productName: 'Lithium-ion Batteries, Power Banks, Cell Phone & Laptop Battery Packs',
    category: 'Electronics & IT',
    scheme: 'Scheme-II (CRS)',
    mandatoryQco: true,
    qcoTitle: 'Compulsory Registration Scheme for Secondary Batteries',
    qcoMinistry: 'MeitY & Ministry of Heavy Industries',
    descriptionInPlainLanguage: 'Strict battery safety standard ensuring lithium-ion cells and power banks do not swell, catch fire, or explode under overcharging, vibration, or short circuits.',
    keyTestingParameters: ['Continuous charging at constant voltage', 'External short circuit test at 55°C', 'Free fall drop test', 'Thermal abuse test up to 130°C', 'Overcharge protection circuit verification'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'ERTL Kolkata', 'NABL Accredited Battery Test Labs'],
    officialDocUrl: 'https://www.crsbis.in/BIS/products.do',
    portalUrl: 'https://www.crsbis.in'
  },
  {
    id: 'is-694',
    isNumber: 'IS 694:2010',
    title: 'Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords for Working Voltages up to 1100 V',
    productName: 'Domestic House Wiring Wires, PVC Cables & Flexible Cords',
    category: 'Electrical Appliances',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Electrical Wires and Cables (Quality Control) Order',
    qcoMinistry: 'DPIIT & Ministry of Power',
    descriptionInPlainLanguage: 'Ensures copper wires used in residential and commercial buildings have pure electrolytic copper conductor and fire-resistant PVC insulation that will not melt or emit toxic gases.',
    keyTestingParameters: ['Conductor electrical resistance (Ohm/km)', 'Insulation tensile strength & elongation at break', 'High voltage test in water immersion', 'Flame retardance (FR / FRLS) performance'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'Western Regional Lab Mumbai', 'CPRI Bengaluru'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-1293',
    isNumber: 'IS 1293:2019',
    title: 'Plugs and Socket-Outlets of Rated Voltage up to 250 V and Rated Current up to 16 A',
    productName: 'Electric Plugs, Power Strips, Wall Sockets (6A & 16A)',
    category: 'Electrical Appliances',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Plugs and Sockets (Quality Control) Order',
    qcoMinistry: 'DPIIT, Ministry of Commerce & Industry',
    descriptionInPlainLanguage: 'Mandates dimensional precision for brass pins, earth pin safety, shutter mechanisms to protect children, and fire-resistant polycarbonate molding.',
    keyTestingParameters: ['Temperature rise at rated current (16A)', 'Insulation resistance & electric strength', 'Mechanical strength & impact hammer test', 'Resistance to heat and abnormal glowing wire test'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'Southern Regional Lab Chennai', 'ERDA Vadodara'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-16102',
    isNumber: 'IS 16102 (Part 1 & 2):2012',
    title: 'Self-Ballasted LED Lamps for General Lighting Services',
    productName: 'LED Bulbs, LED Downlights, Domestic LED Lamps (B22 / E27)',
    category: 'Electronics & IT',
    scheme: 'Scheme-II (CRS)',
    mandatoryQco: true,
    qcoTitle: 'Self-Ballasted LED Lamps Compulsory Registration Order',
    qcoMinistry: 'MeitY & Bureau of Energy Efficiency (BEE)',
    descriptionInPlainLanguage: 'Covers electrical safety and performance requirements for residential LED bulbs to ensure they survive Indian voltage fluctuations without catching fire or burning out quickly.',
    keyTestingParameters: ['Insulation resistance between cap and body', 'Creepage distances & clearance', 'Cap temperature rise', 'Resistance to flame and ignition'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'ERDA Vadodara', 'NABL Recognized Photometric Labs'],
    officialDocUrl: 'https://www.crsbis.in/BIS/products.do',
    portalUrl: 'https://www.crsbis.in'
  },
  {
    id: 'is-1786',
    isNumber: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
    productName: 'TMT Steel Bars (Fe 500, Fe 500D, Fe 550, Fe 600)',
    category: 'Construction & Metals',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Steel and Steel Products (Quality Control) Order',
    qcoMinistry: 'Ministry of Steel',
    descriptionInPlainLanguage: 'Governs all reinforcement TMT bars used in buildings, bridges, and infrastructure. Compulsory ISI mark required; uncertified re-rolled scrap steel is illegal.',
    keyTestingParameters: ['Yield stress and proof stress (MPa)', 'Tensile strength and percentage elongation', 'Bend and rebend test without cracks', 'Carbon equivalent percentage for weldability'],
    recommendedLabs: ['National Metallurgical Laboratory (NML) Jamshedpur', 'Central Laboratory Sahibabad', 'Western Regional Lab Mumbai'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-15298',
    isNumber: 'IS 15298 (Part 2):2016',
    title: 'Personal Protective Equipment — Safety Footwear',
    productName: 'Industrial Safety Shoes & Steel Toe Work Boots',
    category: 'Safety & PPE',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Footwear made from Leather and other materials (QCO)',
    qcoMinistry: 'DPIIT, Ministry of Commerce and Industry',
    descriptionInPlainLanguage: 'Mandatory standard for protective footwear used in factories, construction, and mining to protect toes against 200 Joules of dropping impacts and sole punctures.',
    keyTestingParameters: ['Toe cap impact resistance (200 Joules drop)', 'Toe cap compression resistance (15 kN load)', 'Sole slip resistance on ceramic tile & steel', 'Upper leather water penetration and tear resistance'],
    recommendedLabs: ['Central Leather Research Institute (CLRI) Chennai', 'Footwear Design & Development Institute (FDDI)', 'Central Laboratory Sahibabad'],
    officialDocUrl: 'https://bis.gov.in/index.php/qco-footwear/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-15652',
    isNumber: 'IS 15652:2006',
    title: 'Insulating Mats for Electrical Purposes',
    productName: 'Electrical Insulating Rubber Mats for Substation Panels',
    category: 'Electrical Appliances',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Insulating Mats (Quality Control) Order',
    qcoMinistry: 'Ministry of Power',
    descriptionInPlainLanguage: 'High-grade elastomer mats placed in front of high-voltage electric switchboards to protect engineers and electricians from lethal electrical shocks.',
    keyTestingParameters: ['Di-electric insulation breakdown voltage (up to 33 kV)', 'Tensile strength and elongation', 'Fire retardance & flame resistance', 'Ageing resistance against transformer oils'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'CPRI Bengaluru', 'ERDA Vadodara'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  },
  {
    id: 'is-302',
    isNumber: 'IS 302 (Part 2/Sec 3):2007',
    title: 'Safety of Household and Similar Electrical Appliances — Particular Requirements for Electric Irons',
    productName: 'Electric Dry Irons, Steam Irons & Garment Steamers',
    category: 'Electrical Appliances',
    scheme: 'Scheme-I (ISI Mark)',
    mandatoryQco: true,
    qcoTitle: 'Household Electrical Appliances (Quality Control) Order',
    qcoMinistry: 'Ministry of Commerce & Industry',
    descriptionInPlainLanguage: 'Covers electrical and thermal safety for irons to prevent electric shocks, high-voltage leakage, and fire hazards caused by overheated thermostats.',
    keyTestingParameters: ['Leakage current & electric strength at operating temperature', 'Thermal cut-off safety under thermostat failure', 'Mechanical drop impact of sole plate', 'Supply cord flex testing'],
    recommendedLabs: ['Central Laboratory Sahibabad', 'Northern Regional Lab Mohali', 'Western Regional Lab Mumbai'],
    officialDocUrl: 'https://bis.gov.in/index.php/product-certification/products-under-compulsory-certification/',
    portalUrl: 'https://www.manakonline.in'
  }
];

export const CERTIFICATION_SCHEMES: CertificationSchemeWorkflow[] = [
  {
    id: 'scheme-1',
    schemeCode: 'Scheme-I (ISI Mark)',
    name: 'Product Certification Scheme for Domestic Manufacturers',
    targetAudience: 'Domestic manufacturers operating manufacturing units inside India',
    applicableProducts: 'Bottled drinking water, helmets, cement, electrical cables, steel bars, toys, household appliances',
    portalUrl: 'https://www.manakonline.in',
    estimatedTimeline: '30 to 60 days (Simplified procedure: 30 days)',
    steps: [
      {
        stepNumber: 1,
        title: 'Check Product Conformity & Lab Setup',
        description: 'Ensure your manufacturing unit has complete in-house testing equipment matching the Scheme of Inspection and Testing (SIT) specified by BIS for your product standard.',
        actionRequired: 'Procure required calibrated test gauges and establish an in-house laboratory with qualified testing personnel.',
        documentsNeeded: ['List of manufacturing machinery', 'List of in-house testing equipment with calibration certificates', 'Layout plan of factory', 'Process flow chart from raw material to finished product']
      },
      {
        stepNumber: 2,
        title: 'Online Application on Manakonline',
        description: 'Create an account on the official Manakonline portal (manakonline.in) under e-BIS and submit Form-I with application fees.',
        actionRequired: 'Upload manufacturing plant details, trademark registration/authorization, and test reports.',
        documentsNeeded: ['Proof of factory address (MSME / Udyam / Factory license)', 'Proof of firm registration (CIN / GST / Partnership deed)', 'Brand / Trademark certificate or authorization letter', 'Bank details for fee payments']
      },
      {
        stepNumber: 3,
        title: 'Preliminary Factory Audit by BIS Technical Officer',
        description: 'A designated BIS inspecting officer visits your factory to verify infrastructure, quality control systems, in-house testing capability, and sample sealing.',
        actionRequired: 'Facilitate on-site demonstration of testing by factory quality personnel in front of the BIS officer.',
        documentsNeeded: ['Quality manual & standard operating procedures (SOP)', 'Raw material test certificates (MTC)', 'Calibrated instruments master log']
      },
      {
        stepNumber: 4,
        title: 'Independent Testing of Factory Sample',
        description: 'The sealed counter-sample drawn during the factory audit is dispatched to a BIS recognized laboratory for complete independent testing.',
        actionRequired: 'Pay laboratory testing charges directly to the designated testing facility.',
        documentsNeeded: ['Sample dispatch receipt & code confirmation']
      },
      {
        stepNumber: 5,
        title: 'Grant of License (CML Number)',
        description: 'Upon satisfactory factory inspection and passing test results from the lab, BIS grants the Certificate of Manufacturing License (CML Number).',
        actionRequired: 'Pay annual marking fee and advance minimum marking fee before applying the ISI mark on product packaging.',
        documentsNeeded: ['Agreement of Terms and Conditions', 'Performance bank guarantee (if applicable)']
      }
    ],
    keyFees: 'Application fee: ₹1,000 | Inspection fee: ₹7,000 per day | Annual license fee: ₹1,000 | Marking fee: Product-specific (typically 0.1% to 0.5% of value or fixed unit rate)',
    commonPitfalls: ['Inadequate in-house testing equipment calibration', 'Unqualified quality control personnel in factory', 'Discrepancy in brand trademark ownership', 'Failing microbiological or heavy metal limits during independent testing']
  },
  {
    id: 'scheme-2',
    schemeCode: 'Scheme-II (CRS)',
    name: 'Compulsory Registration Scheme for Electronics & IT Goods',
    targetAudience: 'Indian & Foreign manufacturers of electronics, IT hardware, solar equipment, and secondary batteries',
    applicableProducts: 'Laptops, smartphones, secondary lithium batteries, LED lights, smart watches, server chassis',
    portalUrl: 'https://www.crsbis.in',
    estimatedTimeline: '15 to 25 days after lab test report generation',
    steps: [
      {
        stepNumber: 1,
        title: 'Sample Testing in BIS Recognized NABL Lab',
        description: 'Submit product samples directly to any BIS-recognized laboratory in India for safety testing against the relevant Indian Standard.',
        actionRequired: 'Receive a valid Test Report within 90 days of issuance.',
        documentsNeeded: ['Product technical datasheet', 'Circuit schematic diagram & PCB layout', 'List of safety-critical components with certifications', 'User manual in English and Hindi']
      },
      {
        stepNumber: 2,
        title: 'Appoint Authorized Indian Representative (AIR)',
        description: 'Foreign manufacturers without a registered office in India must appoint a legal AIR who is an Indian citizen/entity liable for compliance.',
        actionRequired: 'Execute an AIR agreement and board resolution on non-judicial stamp paper.',
        documentsNeeded: ['AIR agreement & nomination form', 'AIR ID proof, GST certificate, and address proof']
      },
      {
        stepNumber: 3,
        title: 'Submit Online Application on CRS Portal',
        description: 'Log into crsbis.in, fill in product model series, upload the test report, and pay government processing fees.',
        actionRequired: 'Verify that all family/series models comply with the BIS series grouping guidelines.',
        documentsNeeded: ['Original lab test report (under 90 days old)', 'Brand authorization letter', 'Undertaking for compliance']
      },
      {
        stepNumber: 4,
        title: 'Grant of Registration (R-Number)',
        description: 'BIS scrutinizes the documentation and issues an R-Number (e.g., R-41000000). The manufacturer is authorized to affix the standard BIS CRS mark.',
        actionRequired: 'Print the standard CRS mark with R-Number and website www.bis.gov.in on product rating plate and packaging box.',
        documentsNeeded: ['Artwork of label displaying BIS standard mark and R-Number']
      }
    ],
    keyFees: 'Application fee: ₹53,100 per report/model series (inclusive of GST) | Renewal fee: ₹56,640 for 2 years',
    commonPitfalls: ['Submitting test report older than 90 days', 'Mismatch between component ratings in test report and production BOM', 'Incorrect series grouping violating MeitY guidelines']
  },
  {
    id: 'scheme-4',
    schemeCode: 'Scheme-IV (Hallmarking)',
    name: 'Hallmarking Scheme for Gold & Silver Jewellery',
    targetAudience: 'Jewellers, jewellery manufacturers, retailers, and wholesalers selling gold/silver in India',
    applicableProducts: 'Gold jewellery, gold artefacts, gold bullion/coins, silver jewellery',
    portalUrl: 'https://www.manakonline.in/MANAK/hallmarkingHome',
    estimatedTimeline: 'Instant online registration for jewellers (Zero government fees)',
    steps: [
      {
        stepNumber: 1,
        title: 'Free Jeweller Registration on Manakonline',
        description: 'Government of India has waived all registration fees for gold jewellers. Any retail jeweller can register online in 10 minutes.',
        actionRequired: 'Visit manakonline.in -> Hallmarking -> Jeweller Registration and input GST/PAN details.',
        documentsNeeded: ['GST registration certificate', 'PAN card of enterprise / proprietor', 'Address proof of retail showroom / manufacturing workshop']
      },
      {
        stepNumber: 2,
        title: 'Send Jewellery to Recognized AHC',
        description: 'Submit manufactured jewellery pieces to an authorized Assaying and Hallmarking Centre (AHC) for testing and laser stamping.',
        actionRequired: 'Generate online delivery challan with piece counts, weight, and declared karat purity.',
        documentsNeeded: ['Inward delivery challan with itemized description']
      },
      {
        stepNumber: 3,
        title: 'XRF & Fire Assay Testing at AHC',
        description: 'The AHC draws samples and tests purity. If gold matches or exceeds the declared fineness (e.g. 916 for 22K), it passes.',
        actionRequired: 'AHC tests within 48 hours as per BIS turnaround guidelines.',
        documentsNeeded: ['AHC internal test log']
      },
      {
        stepNumber: 4,
        title: 'HUID Generation & Laser Marking',
        description: 'The AHC logs into the central BIS Hallmarking software, generates a unique 6-digit alphanumeric code (HUID) for each piece, and lasers all 3 marks.',
        actionRequired: 'Retrieve hallmarked jewellery with official certificate invoice.',
        documentsNeeded: ['Hallmarking invoice: ₹45 + GST per piece for gold']
      }
    ],
    keyFees: 'Jeweller registration fee: ₹0 (Waived by GoI) | Hallmarking charge at AHC: ₹45 + GST per gold article, ₹35 + GST per silver article',
    commonPitfalls: ['Selling unhallmarked gold in notified mandatory districts', 'Displaying imitation hallmark without 6-digit HUID', 'Under-caratage (fineness below declared Karat)']
  }
];

export const BIS_TESTING_LABORATORIES: BisTestingLab[] = [
  {
    id: 'lab-cl-sahibabad',
    name: 'BIS Central Laboratory (CL), Sahibabad',
    type: 'Central Laboratory',
    region: 'North',
    address: 'Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, Uttar Pradesh - 201010',
    contactEmail: 'cl@bis.gov.in',
    phone: '+91-120-4177100',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiology', 'Metallurgy', 'Electronics'],
    keyProductScopes: [
      'Packaged Drinking Water & Mineral Water (IS 10500, IS 14543)',
      'Children Safety Toys (IS 9873 all parts)',
      'Two-Wheeler Protective Helmets (IS 4151)',
      'PVC Insulated Cables & Wires (IS 694)',
      'Domestic Electrical Appliances & Irons (IS 302)',
      'TMT Steel Bars & Structural Steel (IS 1786)',
      'Secondary Lithium Batteries (IS 16046)'
    ]
  },
  {
    id: 'lab-nrol-mohali',
    name: 'BIS Northern Regional Office Laboratory (NROL)',
    type: 'Regional Laboratory',
    region: 'North',
    address: 'Sector 62, Phase VII, SAS Nagar, Mohali, Punjab - 160062',
    contactEmail: 'nrol@bis.gov.in',
    phone: '+91-172-2290000',
    disciplines: ['Chemical', 'Mechanical', 'Electrical', 'Microbiology'],
    keyProductScopes: [
      'Agricultural pumps and electric motors',
      'Packaged Drinking Water',
      'PVC pipes and drainage fittings',
      'LPG cylinders and regulators',
      'Cement and building concrete testing'
    ]
  },
  {
    id: 'lab-wrol-mumbai',
    name: 'BIS Western Regional Office Laboratory (WROL)',
    type: 'Regional Laboratory',
    region: 'West',
    address: 'Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (East), Mumbai, Maharashtra - 400093',
    contactEmail: 'wrol@bis.gov.in',
    phone: '+91-22-28329295',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiology', 'Metallurgy'],
    keyProductScopes: [
      'Food, edible oils and drinking water products',
      'Plastics, toys and consumer packaging',
      'Electrical switches, plugs, and domestic heaters',
      'Precious metals and chemical purity testing',
      'Industrial valves and steel products'
    ]
  },
  {
    id: 'lab-srol-chennai',
    name: 'BIS Southern Regional Office Laboratory (SROL)',
    type: 'Regional Laboratory',
    region: 'South',
    address: 'CIT Campus, IV Cross Road, Taramani, Chennai, Tamil Nadu - 600113',
    contactEmail: 'srol@bis.gov.in',
    phone: '+91-44-22541216',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiology', 'Textiles'],
    keyProductScopes: [
      'Textiles, protective clothing and safety footwear',
      'Electronics, LED drivers and lamps',
      'Drinking water and beverage testing',
      'Pumps, diesel engines and automotive components',
      'Electrical transformers and switchgear'
    ]
  },
  {
    id: 'lab-erol-kolkata',
    name: 'BIS Eastern Regional Office Laboratory (EROL)',
    type: 'Regional Laboratory',
    region: 'East',
    address: '1/14, C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata, West Bengal - 700054',
    contactEmail: 'erol@bis.gov.in',
    phone: '+91-33-23207080',
    disciplines: ['Chemical', 'Mechanical', 'Metallurgy', 'Microbiology'],
    keyProductScopes: [
      'Primary steel, billets, galvanized sheets and TMT bars',
      'Jute bags and geo-textiles',
      'Water purification units and packaged drinking water',
      'Mining equipment and safety wires',
      'Chemical fertilizers and raw minerals'
    ]
  }
];

const STOP_WORDS = new Set(['what', 'is', 'the', 'for', 'a', 'an', 'of', 'in', 'to', 'and', 'under', 'do', 'i', 'need', 'standard', 'standards', 'indian', 'bis', 'please', 'tell', 'me', 'how', 'which', 'get', 'give']);

export function findStandardByQuery(query: string): IndianStandardItem[] {
  const raw = query.toLowerCase().trim();
  if (!raw) return INDIAN_STANDARDS_DATABASE.slice(0, 6);

  // Exact standard number match check (e.g. 10500, 1417, 9873, 4151, 16046, 13252, 694, 1293)
  const numberMatch = raw.match(/\b\d{3,5}\b/);
  if (numberMatch) {
    const num = numberMatch[0];
    const exactNumMatches = INDIAN_STANDARDS_DATABASE.filter(item => item.isNumber.includes(num));
    if (exactNumMatches.length > 0) return exactNumMatches;
  }

  // Tokenize query words
  const tokens = raw
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  if (tokens.length === 0) return INDIAN_STANDARDS_DATABASE.slice(0, 6);

  const scored = INDIAN_STANDARDS_DATABASE.map(item => {
    let score = 0;
    const prodLower = item.productName.toLowerCase();
    const titleLower = item.title.toLowerCase();
    const descLower = item.descriptionInPlainLanguage.toLowerCase();
    const catLower = item.category.toLowerCase();

    for (const token of tokens) {
      if (prodLower.includes(token)) score += 10;
      if (titleLower.includes(token)) score += 6;
      if (descLower.includes(token)) score += 3;
      if (catLower.includes(token)) score += 4;
      if (item.keyTestingParameters.some(p => p.toLowerCase().includes(token))) score += 5;
    }

    return { item, score };
  });

  const matching = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.item);

  return matching.length > 0 ? matching : [];
}

export function findLabsByProductOrRegion(query: string): BisTestingLab[] {
  const raw = query.toLowerCase().trim();
  if (!raw) return BIS_TESTING_LABORATORIES;

  const tokens = raw
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  if (tokens.length === 0) return BIS_TESTING_LABORATORIES;

  const scored = BIS_TESTING_LABORATORIES.map(lab => {
    let score = 0;
    const nameLower = lab.name.toLowerCase();
    const regionLower = lab.region.toLowerCase();
    const addrLower = lab.address.toLowerCase();

    for (const token of tokens) {
      if (nameLower.includes(token)) score += 8;
      if (regionLower.includes(token)) score += 10;
      if (addrLower.includes(token)) score += 6;
      if (lab.disciplines.some(d => d.toLowerCase().includes(token))) score += 7;
      if (lab.keyProductScopes.some(s => s.toLowerCase().includes(token))) score += 10;
    }

    return { lab, score };
  });

  const matching = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.lab);

  return matching.length > 0 ? matching : BIS_TESTING_LABORATORIES;
}
