/* ═══════════════════════════════════════════════════════
   model-lookup.js  —  Pill Selector + Single Search Bar
   Supports: Front Load | Top Load | WDR
═══════════════════════════════════════════════════════ */
(function () {

  const FL_DESC  = {
  "Cotton Normal": "Cotton colour-fast garments such as shirts, pants, uniforms, bed and table linen, towels, nightdresses, pyjamas, underwear, etc.",
  "Cotton Eco Plus": "An energy-efficient cotton wash for lightly to normally soiled cotton items. Achieves effective cleaning at lower temperatures, reducing electricity and water consumption.",
  "Cotton Eco": "A resource-saving wash variant for cotton items, optimising water levels and temperature to deliver clean results while minimising energy use.",
  "Cotton": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",
  "Cotton Whites": "A higher-temperature cotton wash specifically designed for white cotton fabrics, providing thorough cleaning and helping maintain brightness.",
  "Cotton Rinse": "An additional standalone rinse cycle for cotton garments to guarantee complete removal of detergent and softener residues.",
  "Synthetic Daily": "Daily wear garments that are made of polyester, acrylic, or polyamide.",
  "Synthetic": "Polyester, acrylic or polyamide daily wear garments.",
  "CradleWash": "Hand wash only garments, as well as lingerie, delicate washable fabrics made of silk, satin, synthetic or sheer fabrics.",
  "Woolens": "Machine washable woollen garments only. Use appropriate detergent.",
  "Wool": "Machine washable wool and wool-blend garments only. A neutral wool wash detergent is recommended.",
  "Woollens 30": "A 30-minute gentle cycle for machine washable woollen garments. A neutral wool wash detergent is recommended.",
  "Mix/Daily": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",
  "Mix/Daily 60'": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean. Not recommended for silk/delicates, dark clothes, wool, duvets, or curtains.",
  "Mixed Soiled": "Various types of cotton, synthetic or easy-care garments except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",
  "Mixed Soiled+": "Various types of cotton, synthetic or easy-care garments with heavier soiling, except special garments such as silk/delicates, dark clothes, woollens, duvets, curtains, etc.",
  "Mix Soiled 40": "Various types of cotton, synthetic or easy-care garments washed at 40°C — balances effective cleaning with energy efficiency.",
  "Express Wash": "Lightly soiled, coloured laundry made of cotton, linen, synthetic or blended fabrics.",
  "Express 30'": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Completed in 30 minutes.",
  "Express 15'": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics. Completed in 15 minutes — the fastest programme available.",
  "Baby Wear": "Baby wear items such as baby clothes, underwear, cloth diapers, pillows, bed sheets, etc. High temperature wash and extra rinses to ensure better rinse performance and hygiene.",
  "Bulky/Bedding": "Machine washable cotton curtains and large items like blankets and bedding covers.",
  "Bulky": "Machine washable oversized items like blankets and bedding covers.",
  "Hygiene": "A high-temperature sanitising programme that kills bacteria, viruses, and common household allergens. Ideal for underwear, gym wear, towels, and items used by allergy-prone individuals.",
  "Refresh": "For removing odour and de-wrinkling the laundry. Suitable for cotton, synthetic and mixed fabrics.",
  "Anti Allergen": "Cotton and linen fabrics in direct skin contact. Removes allergens through high-temperature wash.",
  "Jeans": "Jeans or other coloured garments that don't bleed colours.",
  "Inner Wear": "Machine washable lingerie or innerwear.",
  "PowerSteam": "Recommended for effective stain removal. Lightly soiled cotton, synthetic and mixed fabrics.",
  "Shirts": "Casual shirts that do not need to be ironed after washing.",
  "Shirts/Blouses": "Casual shirts and blouses that do not need to be ironed after washing.",
  "Sports Wear": "Singlets, leggings, jogging clothes and running wear.",
  "Fitness Wear": "Gym and athletic clothing including singlets, leggings, jogging clothes and running wear. Removes sweat and odour while preserving performance fabric properties.",
  "Dark Wash": "Dark-coloured cotton or easy-care fabric garments.",
  "Uniform": "Cotton colour-fast work uniforms, shirts and school wear.",
  "Linen": "Household linen items such as bed sheets, table linen, and towels. Effective stain removal with proper care for the fabric blend.",
  "Cotton Coloured": "Coloured cotton garments requiring gentle lower-temperature washing to preserve vibrancy and prevent colour run or fading.",
  "Curtains": "Machine washable cotton curtains washed with gentle action and low spin speed to avoid distortion and creasing.",
  "Spin Dry/Drain": "A standalone water-extraction cycle that spins laundry at high speed to remove residual water, or drains remaining water from the drum — no washing involved.",
  "Additives/Rinse + Spin": "An extra rinse cycle followed by a full spin to thoroughly flush out detergent or fabric-softener residues — especially useful for people with sensitive skin.",
  "Tub Clean": "Run this programme to eliminate impurities, scaling, bacteria and unpleasant smell from the washing machine.",
  "Daily Wear": "A balanced programme for normally soiled everyday clothing such as casual shirts, trousers, and mixed fabrics — efficient use of water and energy.",
  "Quick 30": "A condensed 30-minute wash for small loads of lightly soiled clothes or recently worn garments.",
  "Eco Wash": "An environment-conscious programme that uses lower water temperatures and reduced cycle time to minimise energy and water consumption while cleaning lightly soiled items effectively.",
  "Active Wear/Sports wear": "Specially designed for sportswear and activewear — removes sweat and odour while protecting performance fabric.",
  "Anti-Allergen": "Cotton and linen fabrics in direct skin contact. Removes allergens through high-temperature wash with extra rinses.",
  "Bulky Bedding": "Wash cycle for large bulky items such as blankets, duvets and bedding covers.",
  "Bulky/ Bedding": "Machine washable oversized items — blankets, duvets and bedding covers with gentle low-speed spin.",
  "Bulky/ Beddling": "Machine washable large items like blankets and bedding covers.",
  "bulky/Bedding": "Machine washable large items like blankets and bedding covers. Low spin speed protects fabric.",
  "Cotton Normal/ Cotton Eco Plus": "Standard cotton wash for colour-fast garments combined with an eco-plus option for lightly soiled loads.",
  "Cotton Normal/Cotton Eco": "Standard cotton wash for colour-fast garments with an eco variant for lightly soiled loads.",
  "Cotton Normal/Cotton Eco Plus": "Standard cotton wash combined with eco-plus option for colour-fast garments.",
  "Cotton Normal/Cotton Eco Plus/Uniform": "Standard or eco cotton wash also covering work uniforms.",
  "Cotton/ Cotton Eco": "Standard or eco cotton wash for colour-fast garments.",
  "Cotton/Cotton Eco": "Standard or eco cotton wash for colour-fast garments.",
  "Cotton/Cotton Eco Plus": "Standard or eco-plus cotton wash for colour-fast garments.",
  "CradleWash®": "Registered IFB technology — cradle-like drum motion for safe, gentle washing of delicate fabrics.",
  "Cradlewash": "Gentle cradle-like drum movement for delicate fabrics — silk, satin, lingerie and sheer fabrics.",
  "Cradlewash®": "Registered IFB technology for gentle, damage-free washing of delicate garments.",
  "CrandleWash®": "Gentle drum motion for safe cleaning of delicate fabrics.",
  "Cradle Wash": "Cradle-like drum movement for safe, gentle washing of delicate garments.",
  "Express 15": "Lightly soiled coloured laundry. Completed in 15 minutes — the fastest programme available.",
  "Express 15'/Express 30": "Lightly soiled coloured laundry available in a 15-minute or 30-minute cycle.",
  "Express 15’": "Lightly soiled coloured laundry. Completed in 15 minutes.",
  "Express 30": "Lightly soiled coloured laundry. Completed in 30 minutes.",
  "Express 30’": "Lightly soiled coloured laundry. Completed in 30 minutes.",
  "HYGIENE": "High-temperature sanitising cycle that kills bacteria, viruses and common household allergens.",
  "HYGIENE*": "High-temperature sanitising cycle that kills bacteria, viruses and common household allergens.",
  "Mix Soiled": "Various fabric types with moderate soiling washed in a single efficient cycle.",
  "Mix/ Daily": "Cotton, synthetic and easy-care garments. Not suitable for silk, delicates, dark clothes, wool or duvets.",
  "Mix/Daily 60’": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean.",
  "Mixed": "Versatile programme for a mixed load of cotton, synthetic and easy-care fabrics.",
  "Mixed Soiled +": "Mixed load of cotton, synthetic or easy-care garments with heavier soiling.",
  "Mixed Soiled/Mixed Solid": "Mixed fabric load for moderately to heavily soiled garments of various fabric types.",
  "Mixed/Soiled": "Mixed fabric load for normally soiled everyday clothing.",
  "Power Steam": "Steam-assisted wash for germ-free, softer and better-smelling clothes.",
  "Power Steam*": "Steam-assisted wash for germ-free, softer and better-smelling clothes.",
  "PowerSteam®": "Registered IFB technology — 2X power steam for superior germ removal and fabric care.",
  "PowerStream": "Powerful water stream action for deep penetration and effective cleaning.",
  "Synthetic/ Daily": "Synthetic and easy-care fabrics for daily wear. Gentle drum action protects fibre texture.",
  "Synthetic/Daily": "Synthetic and easy-care fabrics for daily wear. Gentle drum action protects fibre texture.",
  "Uniform/Linen": "Cotton colour-fast work uniforms, household linen, bed sheets and table linen.",
  "Uniform/Linen/Cotton coloured's/cotton whites": "Combined cycle for uniforms, linen, coloured and white cotton items.",
  "Woollens": "Machine washable woollen garments — gentle drum action and cool temperatures preserve natural wool properties.",
  "2D Wash": "Two-directional water jets ensure thorough detergent mixing and rinsing.",
  "2D Shower System": "Dual shower nozzles spray water evenly for complete soaking and rinsing.",
  "2D/3D Wash": "Combined 2D or 3D wash system depending on load size for thorough cleaning.",
  "3D Wash": "3D dynamic water jets and drum rotation dissolve detergent, loosen tough dirt and rinse it away.",
  "3D Wash System": "3D dynamic water jets and drum rotation work together for a deep, thorough clean.",
  "3D/4D Wash": "Combined 3D or 4D wash system depending on model for superior deep cleaning.",
  "4D Wash": "Jets of water and paddle showers ensure complete soaking — detergent solution penetrates every fibre.",
  "7 Swirl": "Seven-directional swirl wash action for thorough dirt removal from all fabric angles.",
  "7 Swirl Wash": "Seven-directional swirl wash for thorough cleaning of everyday fabrics.",
  "7 Swirl Powered by Ai": "AI-optimised seven-directional swirl wash for efficient, fabric-safe cleaning.",
  "9 Swirl": "Nine-directional swirl wash action for superior dirt removal across all fabric surfaces.",
  "9 Swirl Wash": "Nine-directional swirl wash for superior cleaning across all fabric surfaces.",
  "9 Swirl Powered by Ai": "AI-optimised nine-directional swirl wash for best-in-class cleaning performance.",
  "9 Swirl®": "Registered IFB technology — nine-directional swirl wash for deep fabric cleaning.",
  "Ai Dos": "Automatically dispenses the correct amount of detergent based on load weight and soil level.",
  "AI Dos": "Automatically dispenses the correct amount of detergent based on load weight and soil level.",
  "Air Bubble Wash": "Millions of fine air bubbles penetrate fabric fibres to loosen and lift dirt gently.",
  "Air Bubble Wash System": "Fine air bubbles combined with water action gently but effectively remove dirt from fabrics.",
  "Air-Bubble Wash": "Fine air bubbles penetrate fabric fibres to loosen and lift stubborn dirt gently.",
  "Anti Crease": "Periodically rotates the drum after the wash cycle ends to prevent wrinkles from setting.",
  "Aqua Energie": "Energises water molecules to carry detergent deep into fabric fibres for a thorough wash.",
  "Aqua Energy": "Energises water molecules to carry detergent deep into fabric fibres for a thorough wash.",
  "Aqua Restart": "Automatically resumes the wash cycle from where it stopped after a power interruption.",
  "Auto Balance System": "Automatically senses and redistributes unbalanced laundry for a stable spin cycle.",
  "Auto Foam Control System": "Detects excess foam and automatically adds an extra rinse to remove it completely.",
  "Auto Imbalance System": "Automatically detects and corrects load imbalance by redistributing clothes for a stable spin.",
  "Auto Restart": "Resumes the wash cycle automatically after a power failure.",
  "Auto Tub Clean": "Runs a drum-cleaning cycle to remove impurities, bacteria and odours automatically.",
  "BLDC Motor Technology": "Brushless DC motor delivers high efficiency, low noise, minimal vibration and longer motor life.",
  "Child Lock": "Locks the control panel to prevent children from accidentally changing settings.",
  "Cool Down Cycle": "Gradually reduces wash temperature at cycle end to protect heat-sensitive fabrics.",
  "Crescent Moon Drum": "The crescent moon drum design cushions clothes with water to protect fabric integrity.",
  "Drum Lamp": "LED light inside the drum for easy loading and unloading in low-light conditions.",
  "High-Low Voltage Protection": "Stops the program if voltage drops below 165V or exceeds 270V to protect machine components.",
  "Hot Rinse": "Rinses laundry in warm water for more effective removal of detergent residue and allergens.",
  "Inbuilt Easy Iron": "Uses steam and controlled tumbling to reduce creases, making clothes easier to iron.",
  "Laundry Add": "Pause the cycle in the early stage to add forgotten garments, then resume without restarting.",
  "Laundry Add Option": "Allows adding forgotten items during the early stage of the wash cycle.",
  "Oxyjet Technology": "Oxygen-infused water jets penetrate fabric fibres to lift stains and refresh garments.",
  "Oxyjet® Technology": "Registered IFB technology — oxygen-infused jets for deep stain lifting and fabric refreshing.",
  "Powered by Ai": "AI-driven sensing detects load, optimises water level and selects the best wash program automatically.",
  "Powered by AI": "AI-driven sensing detects load, optimises water level and selects the best wash program automatically.",
  "Pre Wash": "An initial soak and rinse before the main wash — ideal for heavily soiled garments.",
  "Program Memory Backup": "Remembers the exact cycle position and resumes after a power failure without wasting water or time.",
  "Quick Wash": "Quick wash for small loads of lightly soiled garments.",
  "Rapid Wash": "A quick wash cycle for small lightly soiled loads when time is short.",
  "Start/Pause": "Pause mid-cycle to add forgotten laundry, then resume without restarting.",
  "Start/Pause (Program Interrupt)": "Pause the cycle at any point to add or remove garments, then resume seamlessly.",
  "Start/Pause Program Interrupt": "Pause the running cycle to add or remove laundry, then continue from exactly where it stopped.",
  "Steam Wash": "Steam injected during the wash for deeper cleaning, better stain removal and fresher clothes.",
  "Technology": "Proprietary IFB wash technology integrated into this model for enhanced cleaning performance.",
  "Baby Wear (7 Kg/8 Kg)": "High-temperature wash with extra rinses for baby clothes — available on 7 and 8 kg models.",
  "Blankets": "Dedicated cycle for machine washable blankets with enhanced wash movement.",
  "Blankets (Curtain/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "Blankets(Curtain/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "Delicates": "Gentle wash for woollens, silk, and delicate garments.",
  "Express": "Quick cycle for small lightly soiled loads.",
  "Express 30°": "Lightly soiled laundry washed at 30°C in 30 minutes.",
  "Favourite (SDSG 7 Kg/SSG 8 Kg)": "Save preferred wash settings — available on SDSG 7 kg and SSG 8 kg models.",
  "Hygiene+": "Enhanced sanitising cycle with higher temperature and extra rinse for thorough germ removal.",
  "My Cycle (7 Kg/8 Kg)": "Save and reuse preferred wash settings — available on 7 and 8 kg models.",
  "Only Rinse": "Standalone rinse cycle for freshening clothes or removing detergent residue.",
  "Only Spin": "Standalone spin cycle to extract water from already-washed laundry.",
  "Rinse + Spin": "Combined rinse and spin cycle for quick freshening of lightly soiled clothes.",
  "Rinse+Spin": "Combined rinse and spin for removing detergent residue or quick freshening.",
  "STAINFIGHTER™": "Uses high water temperature to remove tough stains effectively.",
  "Sari": "Gentle program for machine washable sarees to prevent damage to delicate fabric.",
  "Silent (SDSG 7 Kg/SSG 8 Kg)": "Quieter operation mode — available on SDSG 7 kg and SSG 8 kg models.",
  "Smart Sense + Wash + Rinse": "Smart Sense with Wash and Rinse LEDs active — auto-detects load and optimises full cycle.",
  "Smart Sense*": "Intelligent load-sensing program that auto-adjusts water level and wash time.",
  "Spin": "Standalone high-speed spin to extract maximum water from washed laundry.",
  "StainFighterTM": "Uses high water temperature to remove tough stains effectively.",
  "Wash + Rinse": "Combined wash and rinse cycle without a final spin.",
  "Ai": "AI-based sensing that detects load, optimises water level and selects the ideal wash program.",
  "Auto Tub clean": "Automatically cleans the tub to prevent bacteria, mould and odour build-up.",
  "DeepClean Powered by Ai": "AI-powered deep cleaning that senses load and optimises wash parameters for maximum stain removal.",
  "Delay": "Delays the start of the wash cycle to a preferred later time for scheduling convenience.",
  "In-built heater": "Heats water to the selected temperature for better stain removal and allergen elimination.",
  "Tub Clean Wash": "Dedicated wash cycle for cleaning the drum, removing detergent residue, bacteria and bad odours.",
  "Aroma": "A refreshing cycle that uses fragrance to leave clothes smelling fresh after washing.",
  "Aroma.": "A refreshing cycle that uses fragrance to leave clothes smelling fresh after washing.",
  "Cupboard Dry / Eco Dry": "Cupboard Dry removes all moisture for immediate storage; Eco Dry uses less energy for lightly damp clothes."
};
  const TL_DESC  = {
  "Smart Sense": "An intelligent program that uses advanced sensors and microchip technology to automatically determine the laundry load and optimise water, wash time, rinse cycles and spinning time.",
  "Smart Sense + Wash": "Program combination where Smart Sense and Wash LEDs glow together.",
  "Wash + Rinse + Spin": "Combination program for washing, rinsing and spinning.",
  "Only Wash": "Performs only washing operation.",
  "Aqua Save": "Saves water from the last rinse cycle for the next wash cycle.",
  "Express 30": "Lightly soiled coloured laundry. Completed in 30 minutes.",
  "Heavy": "Used for heavy laundry items.",
  "Delicate": "Gentle wash for woollens/delicate garments.",
  "Mix/Daily": "Everyday clothes washing program with rhythms for stubborn dirt removal.",
  "Anti-Allergen": "Cotton and linen fabrics in direct skin contact. Removes allergens through high-temperature wash with extra rinses.",
  "Jeans": "Special wash for denim/jeans garments.",
  "Blankets (Curtains/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "StainFighter™": "Uses high water temperature to remove stains.",
  "My Cycle": "Saves preferred program settings for repeated use.",
  "Baby Wear": "Uses 40°C water and extra rinses for baby clothes.",
  "Tub Clean": "Cleans impurities, bacteria and odours from tub.",
  "Saree": "Program for machine washable sarees.",
  "Cotton": "For cotton garments like shirts, towels, uniforms, linens etc.",
  "Sportswear": "Dedicated program for washing sportswear and performance fabrics with gentle yet effective cleaning action.",
  "Silent": "Operates with reduced noise and smoother drum movement for quieter washing performance.",
  "Delay Wash": "Allows the user to delay the start of the wash cycle to a preferred later time for added convenience and flexible scheduling.",
  "Power Wash": "Designed for heavily soiled clothes with enhanced washing intensity and stronger wash action for deep cleaning performance.",
  "Sports Wear": "Specially designed for sportswear and activewear fabrics to gently remove sweat, odour and dirt while protecting fabric quality.",
  "Hygiene": "Uses enhanced washing and rinsing performance to provide hygienic cleaning by reducing germs, allergens and detergent residue from garments.",
  "Favourite": "Allows users to save and quickly access their preferred wash settings for regular laundry loads.",
  "Synthetic": "Suitable for synthetic fabrics such as polyester, nylon and blended garments using controlled wash action to protect fabric texture.",
  "Bulky(Blankets/Jeans/Curtains)": "Suitable for synthetic fabrics such as polyester, nylon and blended garments using controlled wash action to protect fabric texture.",
  "Bulky (Blankets/Jeans/Curtains)": "Special wash program for bulky garments like blankets, curtains and jeans using stronger wash movements for effective cleaning.",
  "Blankets/Curtains/Bulky": "Designed for large and bulky laundry items with optimised water levels and wash movements for thorough cleaning.",
  "Aqua Conserve": "Water-saving wash program that optimises water usage while maintaining effective washing performance.",
  "Favorite": "Stores customised wash settings for quick selection of frequently used washing preferences.",
  "Powered by Ai": "AI-driven sensing detects load, optimises water level and selects the best wash program automatically.",
  "Deep Clean": "The intuitive sensing logic in the machine detects the load, optimises water level and optimises wash program automatically for best care and efficient washing.",
  "Aqua Energie": "Energises water molecules to carry detergent deep into fabric fibres for a thorough wash.",
  "Aqua Spa Therapy": "An indulgent water treatment surrounds your clothes. Stubborn stains are shaken, loosened and rinsed away to rejuvenate clothes.",
  "Pentad Pulsator": "The robust five vane pulsator removes stubborn dirt quickly for best-in-class washing.",
  "Triadic Pulsator": "Soft Scrub Pads, Swirl Jets and Centre Punch work together to remove stubborn dirt effectively.",
  "Tri Axial Cloth Movements": "The new Pentad vanes move clothes on all three axes (X, Y, Z) to gently separate dirt from fabrics.",
  "Bi-Axial Clothes Rotation": "Clothes rotate horizontally and tumble vertically for a 360° wash.",
  "4-Bi-Axial Clothes Rotation": "Clothes rotate horizontally and tumble vertically for a 360° wash.",
  "3D Wash": "3D dynamic water jets and drum rotation dissolve detergent, loosen tough dirt and rinse it away.",
  "4D Wash": "Jets of water and paddle showers ensure complete soaking — detergent solution penetrates every fibre.",
  "Crescent Moon Drum": "The crescent moon drum design cushions clothes with water to protect fabric integrity.",
  "Intelligent Wash Programs": "Lets clothes enjoy the sensory pleasure of Deep Clean with IFB's intelligent wash programs.",
  "In-built Heater": "The in-built heater allows temperature selection for removing tough stains and allergens.",
  "Clean with Steam": "Power Steam™ with 2X steam provides germ free and soft clothes.",
  "ActivMix": "Ensures thorough mixing of detergent and water for better wash performance.",
  "Eco Inverter Motor": "Consumes upto 40% less energy and operates quietly with minimal vibration.",
  "Soft Scrub Pads": "Gently scrubs off stubborn dirt.",
  "Swirl Jets": "Powerful water jets remove dirt from every corner of the fabric.",
  "Centre Punch": "Gentle mechanical action squeezes the dirt out.",
  "Auto Tub Clean": "Runs a drum-cleaning cycle to remove impurities, bacteria and odours automatically.",
  "High-Low Voltage Protection": "Stops the program if voltage drops below 165V or exceeds 270V to protect machine components.",
  "Program Memory Backup": "Remembers the exact cycle position and resumes after a power failure without wasting water or time.",
  "Program Memory": "Automatically balances clothes inside the tub to stabilise the spin cycle.",
  "Auto Imbalance System": "Automatically detects and corrects load imbalance by redistributing clothes for a stable spin.",
  "Child Lock": "Locks the control panel to prevent children from accidentally changing settings.",
  "Auto Softener Dispenser": "A special compartment where you can add softener before starting the wash.",
  "Auto Softner Dispenser": "A special compartment where you can add softener before starting the wash.",
  "Bleach Dispenser": "A special inlet to add bleach to the wash.",
  "Wheels": "Allows easy movement of the washing machine.",
  "Lint Tower Filter": "Captures fine fabric fibres floating inside the tub and prevents them from sticking to clothes.",
  "Tower Filter": "Captures fabric fibres inside the tub and prevents them from catching onto clothes.",
  "Air Dry": "Fresh air enters through the exchange window for clean and hygienic drying.",
  "Air Dry Option": "Fresh air enters through the exchange window for clean and hygienic drying.",
  "Spray Rinse": "A jet sprays water evenly over clothes for optimum washing and rinsing.",
  "Shower Rinse": "A jet sprays water evenly over clothes for optimum washing and rinsing.",
  "Tub Dry": "Ensures tub hygiene after wash cycles.",
  "Soft Closing": "The door shuts softly and smoothly, helping prolong door life.",
  "Soft Closing Lid": "The door shuts softly and smoothly, helping prolong door life.",
  "Drum Lamp (LED)": "Provides light inside the drum for easy loading and unloading during darkness.",
  "Drum Lamp (LED Lamp)": "Provides light inside the drum for easy loading and unloading during darkness.",
  "Delay Start": "Allows delayed start of the wash cycle for added convenience.",
  "Tub Clean Reminder": "Cleans impurities, bacteria and odours from the tub.",
  "PreClean": "Performs a preliminary cleaning cycle before the main wash to loosen dirt and stains.",
  "Pre Clean": "Performs a preliminary cleaning cycle before the main wash to loosen dirt and stains.",
  "Auto Restart": "Resumes the wash cycle automatically after a power failure.",
  "Buzzer": "Provides an audible alert during or after the wash cycle.",
  "Fresh Air Dry": "Fresh air enters through the exchange window for clean and hygienic drying.",
  "Drum Hygiene": "Maintains drum cleanliness and reduces bacteria, odours and detergent residue.",
  "Spray Wash": "Uses directed water spray action for improved detergent penetration and wash performance.",
  "9 Swirl Wash": "Nine-directional swirl wash for superior cleaning across all fabric surfaces.",
  "9 Swirl wash": "Swirl technology that gently cares for clothes.",
  "Active Wear/Sports wear": "Specially designed for sportswear and activewear — removes sweat and odour while protecting performance fabric.",
  "Bulky Bedding": "Wash cycle for large bulky items such as blankets, duvets and bedding covers.",
  "Bulky/ Bedding": "Machine washable oversized items — blankets, duvets and bedding covers with gentle low-speed spin.",
  "Bulky/ Beddling": "Machine washable large items like blankets and bedding covers.",
  "bulky/Bedding": "Machine washable large items like blankets and bedding covers. Low spin speed protects fabric.",
  "Cotton Normal/ Cotton Eco Plus": "Standard cotton wash for colour-fast garments combined with an eco-plus option for lightly soiled loads.",
  "Cotton Normal/Cotton Eco": "Standard cotton wash for colour-fast garments with an eco variant for lightly soiled loads.",
  "Cotton Normal/Cotton Eco Plus": "Standard cotton wash combined with eco-plus option for colour-fast garments.",
  "Cotton Normal/Cotton Eco Plus/Uniform": "Standard or eco cotton wash also covering work uniforms.",
  "Cotton/ Cotton Eco": "Standard or eco cotton wash for colour-fast garments.",
  "Cotton/Cotton Eco": "Standard or eco cotton wash for colour-fast garments.",
  "Cotton/Cotton Eco Plus": "Standard or eco-plus cotton wash for colour-fast garments.",
  "CradleWash®": "Registered IFB technology — cradle-like drum motion for safe, gentle washing of delicate fabrics.",
  "Cradlewash": "Gentle cradle-like drum movement for delicate fabrics — silk, satin, lingerie and sheer fabrics.",
  "Cradlewash®": "Registered IFB technology for gentle, damage-free washing of delicate garments.",
  "CrandleWash®": "Gentle drum motion for safe cleaning of delicate fabrics.",
  "Cradle Wash": "Cradle-like drum movement for safe, gentle washing of delicate garments.",
  "Express 15": "Lightly soiled coloured laundry. Completed in 15 minutes — the fastest programme available.",
  "Express 15'/Express 30": "Lightly soiled coloured laundry available in a 15-minute or 30-minute cycle.",
  "Express 15’": "Lightly soiled coloured laundry. Completed in 15 minutes.",
  "Express 30’": "Lightly soiled coloured laundry. Completed in 30 minutes.",
  "HYGIENE": "High-temperature sanitising cycle that kills bacteria, viruses and common household allergens.",
  "HYGIENE*": "High-temperature sanitising cycle that kills bacteria, viruses and common household allergens.",
  "Mix Soiled": "Various fabric types with moderate soiling washed in a single efficient cycle.",
  "Mix/ Daily": "Cotton, synthetic and easy-care garments. Not suitable for silk, delicates, dark clothes, wool or duvets.",
  "Mix/Daily 60’": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean.",
  "Mixed": "Versatile programme for a mixed load of cotton, synthetic and easy-care fabrics.",
  "Mixed Soiled +": "Mixed load of cotton, synthetic or easy-care garments with heavier soiling.",
  "Mixed Soiled/Mixed Solid": "Mixed fabric load for moderately to heavily soiled garments of various fabric types.",
  "Mixed/Soiled": "Mixed fabric load for normally soiled everyday clothing.",
  "Power Steam": "Steam-assisted wash for germ-free, softer and better-smelling clothes.",
  "Power Steam*": "Steam-assisted wash for germ-free, softer and better-smelling clothes.",
  "PowerSteam®": "Registered IFB technology — 2X power steam for superior germ removal and fabric care.",
  "PowerStream": "Powerful water stream action for deep penetration and effective cleaning.",
  "Synthetic/ Daily": "Synthetic and easy-care fabrics for daily wear. Gentle drum action protects fibre texture.",
  "Synthetic/Daily": "Synthetic and easy-care fabrics for daily wear. Gentle drum action protects fibre texture.",
  "Uniform/Linen": "Cotton colour-fast work uniforms, household linen, bed sheets and table linen.",
  "Uniform/Linen/Cotton coloured's/cotton whites": "Combined cycle for uniforms, linen, coloured and white cotton items.",
  "Woollens": "Machine washable woollen garments — gentle drum action and cool temperatures preserve natural wool properties.",
  "2D Wash": "Two-directional water jets ensure thorough detergent mixing and rinsing.",
  "2D Shower System": "Dual shower nozzles spray water evenly for complete soaking and rinsing.",
  "2D/3D Wash": "Combined 2D or 3D wash system depending on load size for thorough cleaning.",
  "3D Wash System": "3D dynamic water jets and drum rotation work together for a deep, thorough clean.",
  "3D/4D Wash": "Combined 3D or 4D wash system depending on model for superior deep cleaning.",
  "7 Swirl": "Seven-directional swirl wash action for thorough dirt removal from all fabric angles.",
  "7 Swirl Wash": "Seven-directional swirl wash for thorough cleaning of everyday fabrics.",
  "7 Swirl Powered by Ai": "AI-optimised seven-directional swirl wash for efficient, fabric-safe cleaning.",
  "9 Swirl": "Nine-directional swirl wash action for superior dirt removal across all fabric surfaces.",
  "9 Swirl Powered by Ai": "AI-optimised nine-directional swirl wash for best-in-class cleaning performance.",
  "9 Swirl®": "Registered IFB technology — nine-directional swirl wash for deep fabric cleaning.",
  "Ai Dos": "Automatically dispenses the correct amount of detergent based on load weight and soil level.",
  "AI Dos": "Automatically dispenses the correct amount of detergent based on load weight and soil level.",
  "Air Bubble Wash": "Millions of fine air bubbles penetrate fabric fibres to loosen and lift dirt gently.",
  "Air Bubble Wash System": "Fine air bubbles combined with water action gently but effectively remove dirt from fabrics.",
  "Air-Bubble Wash": "Fine air bubbles penetrate fabric fibres to loosen and lift stubborn dirt gently.",
  "Anti Crease": "Periodically rotates the drum after the wash cycle ends to prevent wrinkles from setting.",
  "Aqua Energy": "Energises water molecules to carry detergent deep into fabric fibres for a thorough wash.",
  "Aqua Restart": "Automatically resumes the wash cycle from where it stopped after a power interruption.",
  "Auto Balance System": "Automatically senses and redistributes unbalanced laundry for a stable spin cycle.",
  "Auto Foam Control System": "Detects excess foam and automatically adds an extra rinse to remove it completely.",
  "BLDC Motor Technology": "Brushless DC motor delivers high efficiency, low noise, minimal vibration and longer motor life.",
  "Cool Down Cycle": "Gradually reduces wash temperature at cycle end to protect heat-sensitive fabrics.",
  "Drum Lamp": "LED light inside the drum for easy loading and unloading in low-light conditions.",
  "Hot Rinse": "Rinses laundry in warm water for more effective removal of detergent residue and allergens.",
  "Inbuilt Easy Iron": "Uses steam and controlled tumbling to reduce creases, making clothes easier to iron.",
  "Laundry Add": "Pause the cycle in the early stage to add forgotten garments, then resume without restarting.",
  "Laundry Add Option": "Allows adding forgotten items during the early stage of the wash cycle.",
  "Oxyjet Technology": "Oxygen-infused water jets penetrate fabric fibres to lift stains and refresh garments.",
  "Oxyjet® Technology": "Registered IFB technology — oxygen-infused jets for deep stain lifting and fabric refreshing.",
  "Powered by AI": "AI-driven sensing detects load, optimises water level and selects the best wash program automatically.",
  "Pre Wash": "An initial soak and rinse before the main wash — ideal for heavily soiled garments.",
  "Quick Wash": "Quick wash for small loads of lightly soiled garments.",
  "Rapid Wash": "A quick wash cycle for small lightly soiled loads when time is short.",
  "Start/Pause": "Pause mid-cycle to add forgotten laundry, then resume without restarting.",
  "Start/Pause (Program Interrupt)": "Pause the cycle at any point to add or remove garments, then resume seamlessly.",
  "Start/Pause Program Interrupt": "Pause the running cycle to add or remove laundry, then continue from exactly where it stopped.",
  "Steam Wash": "Steam injected during the wash for deeper cleaning, better stain removal and fresher clothes.",
  "Technology": "Proprietary IFB wash technology integrated into this model for enhanced cleaning performance.",
  "Anti Allergen": "Cotton and linen fabrics in direct skin contact. Removes allergens through high-temperature wash.",
  "Baby Wear (7 Kg/8 Kg)": "High-temperature wash with extra rinses for baby clothes — available on 7 and 8 kg models.",
  "Blankets": "Dedicated cycle for machine washable blankets with enhanced wash movement.",
  "Blankets (Curtain/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "Blankets(Curtain/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "Bulky": "Machine washable oversized items like blankets and bedding covers.",
  "Delicates": "Gentle wash for woollens, silk, and delicate garments.",
  "Express": "Quick cycle for small lightly soiled loads.",
  "Express 30°": "Lightly soiled laundry washed at 30°C in 30 minutes.",
  "Favourite (SDSG 7 Kg/SSG 8 Kg)": "Save preferred wash settings — available on SDSG 7 kg and SSG 8 kg models.",
  "Hygiene+": "Enhanced sanitising cycle with higher temperature and extra rinse for thorough germ removal.",
  "My Cycle (7 Kg/8 Kg)": "Save and reuse preferred wash settings — available on 7 and 8 kg models.",
  "Only Rinse": "Standalone rinse cycle for freshening clothes or removing detergent residue.",
  "Only Spin": "Standalone spin cycle to extract water from already-washed laundry.",
  "Rinse + Spin": "Combined rinse and spin cycle for quick freshening of lightly soiled clothes.",
  "Rinse+Spin": "Combined rinse and spin for removing detergent residue or quick freshening.",
  "STAINFIGHTER™": "Uses high water temperature to remove tough stains effectively.",
  "Sari": "Gentle program for machine washable sarees to prevent damage to delicate fabric.",
  "Silent (SDSG 7 Kg/SSG 8 Kg)": "Quieter operation mode — available on SDSG 7 kg and SSG 8 kg models.",
  "Smart Sense + Wash + Rinse": "Smart Sense with Wash and Rinse LEDs active — auto-detects load and optimises full cycle.",
  "Smart Sense*": "Intelligent load-sensing program that auto-adjusts water level and wash time.",
  "Spin": "Standalone high-speed spin to extract maximum water from washed laundry.",
  "StainFighterTM": "Uses high water temperature to remove tough stains effectively.",
  "Uniform": "Cotton colour-fast work uniforms, shirts and school wear.",
  "Wash + Rinse": "Combined wash and rinse cycle without a final spin.",
  "Ai": "AI-based sensing that detects load, optimises water level and selects the ideal wash program.",
  "Auto Tub clean": "Automatically cleans the tub to prevent bacteria, mould and odour build-up.",
  "DeepClean Powered by Ai": "AI-powered deep cleaning that senses load and optimises wash parameters for maximum stain removal.",
  "Delay": "Delays the start of the wash cycle to a preferred later time for scheduling convenience.",
  "In-built heater": "Heats water to the selected temperature for better stain removal and allergen elimination.",
  "Tub Clean Wash": "Dedicated wash cycle for cleaning the drum, removing detergent residue, bacteria and bad odours.",
  "Aroma": "A refreshing cycle that uses fragrance to leave clothes smelling fresh after washing.",
  "Aroma.": "A refreshing cycle that uses fragrance to leave clothes smelling fresh after washing.",
  "Cupboard Dry / Eco Dry": "Cupboard Dry removes all moisture for immediate storage; Eco Dry uses less energy for lightly damp clothes."
};
  const WDR_DESC = {
  "Mix/Daily": "Cotton, synthetic and easy-care garments. Not recommended for special garments like silk/delicates, dark clothes, wool, duvets, curtains, etc.",
  "Cotton/Cotton Eco": "Standard or eco cotton wash for colour-fast garments.",
  "Cotton/Cotton Eco/Uniform/Linen": "Cotton colour-fast garments. Shirts, pants, uniforms, bed and table linen, towels, night dresses, pyjamas, underwear, etc.",
  "Baby Wear": "High temperature and extra rinses for better rinse performance. Recommended for baby clothes, underwear, cloth diapers, pillows, bedsheets, etc.",
  "Anti Allergen": "Cotton and linen fabrics in direct skin contact. Removes allergens through high-temperature wash.",
  "Express 15'": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics.",
  "Express 15' / Express 30'": "Lightly soiled coloured laundry made of cotton, linen, synthetic or blended fabrics.",
  "Refresh": "For removing odour and de-wrinkling the laundry. Cotton, synthetic and mixed fabrics.",
  "Wool": "Machine washable woollen garments only. Use appropriate detergent.",
  "Bulky/Bedding": "Machine washable curtains made of cotton and easy care fabrics. Washes large items such as blankets, bedding covers, sofa covers, pillow covers and bedspreads.",
  "Synthetic": "Polyester, acrylic or polyamide daily wear garments.",
  "CradleWash": "Hand wash and delicate wash garments. Silk, lingerie, satin, synthetic or sheer fabrics.",
  "CradleWash®": "Registered IFB technology — cradle-like drum motion for safe, gentle washing of delicate fabrics.",
  "PowerSteam": "Lightly soiled cotton, synthetic and mixed fabrics items. This cycle removes stains effectively.",
  "PowerSteam®": "Registered IFB technology — 2X power steam for superior germ removal and fabric care.",
  "Active Wear/ Sports wear": "Sports wear such as singlets, leggings, jogging clothes and running wear.",
  "Sports Wear": "Singlets, leggings, jogging clothes and running wear.",
  "Dark Wash": "Dark-coloured garments made of cotton and easy-care fabrics.",
  "Inner Wear": "Machine washable lingerie/inner wear.",
  "Shirts/Blouses": "Casual shirts that do not need to be ironed after washing.",
  "Shirts": "Casual shirts that do not need to be ironed after washing.",
  "Jeans": "Jeans or other coloured garments that don't bleed colours.",
  "Bamboo Wash": "Shirts, t-shirts, underwear, pajamas, towels, sleepwear, and light baby clothing etc. made of natural fiber blends. Gentle cycle with better natural fiber care. Use mild detergent. Do not use for highly soiled garments.",
  "Wash + Dry 2 Hr/Wash + Dry 4 Hr": "Use for lightly soiled laundry, fabrics like cotton, synthetics and easy care garments. Do not use for special garments such as silk, duvets, delicates, dark clothes, wool, curtains etc.",
  "Wash + Dry 2 Hr / Wash + Dry 4 Hr": "Use for lightly soiled laundry, fabrics like cotton, synthetics and easy care garments. Do not use for special garments such as silk, duvets, delicates, dark clothes, wool, curtains etc.",
  "Cupboard Dry/Eco Dry": "Use this program when you want to fold and put away the dried clothes. Can be used for everyday clothes such as cotton and mixed.",
  "Iron Dry": "Use this program to receive ready-to-iron cotton or linen fabrics, at the end of the cycle.",
  "Gentle Dry": "Use this program for easy care textiles and synthetic fabrics. It is suitable for easy care and mixed laundry clothes that require low temperatures for drying.",
  "Time Dry": "You can specify the drying time with this program. Set the time depending on the type of fabric, laundry load and moisture content.",
  "Aroma": "A refreshing cycle that uses fragrance to leave clothes smelling fresh after washing.",
  "Express 15 / Express 30": "Quick wash cycle for lightly soiled garments made of cotton, linen, synthetic or blended fabrics with selectable 15 or 30 minute duration.",
  "Cupboard Dry": "Drying program that dries clothes to a cupboard-ready condition suitable for direct folding and storage.",
  "Express 15": "Lightly soiled coloured laundry. Completed in 15 minutes — the fastest programme available.",
  "Express 15/Express 30": "Quick wash cycle for lightly soiled garments made of cotton, linen, synthetic or blended fabrics with selectable 15 or 30 minute duration.",
  "Power Steam": "Steam-assisted wash for germ-free, softer and better-smelling clothes.",
  "Wash+Dry 4Hr": "Extended wash and dry cycle for mixed laundry loads requiring deeper washing and complete drying within approximately 4 hours.",
  "Wash+Dry 2Hr": "Quick wash and dry cycle suitable for lightly soiled cotton, synthetic and easy-care garments within approximately 2 hours.",
  "Active Wear/Sports wear": "Specially designed for sportswear and activewear — removes sweat and odour while protecting performance fabric.",
  "Anti-Allergen": "Cotton and linen fabrics in direct skin contact. Removes allergens through high-temperature wash with extra rinses.",
  "Bulky Bedding": "Wash cycle for large bulky items such as blankets, duvets and bedding covers.",
  "Bulky/ Bedding": "Machine washable oversized items — blankets, duvets and bedding covers with gentle low-speed spin.",
  "Bulky/ Beddling": "Machine washable large items like blankets and bedding covers.",
  "bulky/Bedding": "Machine washable large items like blankets and bedding covers. Low spin speed protects fabric.",
  "Cotton Normal/ Cotton Eco Plus": "Standard cotton wash for colour-fast garments combined with an eco-plus option for lightly soiled loads.",
  "Cotton Normal/Cotton Eco": "Standard cotton wash for colour-fast garments with an eco variant for lightly soiled loads.",
  "Cotton Normal/Cotton Eco Plus": "Standard cotton wash combined with eco-plus option for colour-fast garments.",
  "Cotton Normal/Cotton Eco Plus/Uniform": "Standard or eco cotton wash also covering work uniforms.",
  "Cotton/ Cotton Eco": "Standard or eco cotton wash for colour-fast garments.",
  "Cotton/Cotton Eco Plus": "Standard or eco-plus cotton wash for colour-fast garments.",
  "Cradlewash": "Gentle cradle-like drum movement for delicate fabrics — silk, satin, lingerie and sheer fabrics.",
  "Cradlewash®": "Registered IFB technology for gentle, damage-free washing of delicate garments.",
  "CrandleWash®": "Gentle drum motion for safe cleaning of delicate fabrics.",
  "Cradle Wash": "Cradle-like drum movement for safe, gentle washing of delicate garments.",
  "Express 15'/Express 30": "Lightly soiled coloured laundry available in a 15-minute or 30-minute cycle.",
  "Express 15’": "Lightly soiled coloured laundry. Completed in 15 minutes.",
  "Express 30": "Lightly soiled coloured laundry. Completed in 30 minutes.",
  "Express 30’": "Lightly soiled coloured laundry. Completed in 30 minutes.",
  "HYGIENE": "High-temperature sanitising cycle that kills bacteria, viruses and common household allergens.",
  "HYGIENE*": "High-temperature sanitising cycle that kills bacteria, viruses and common household allergens.",
  "Mix Soiled": "Various fabric types with moderate soiling washed in a single efficient cycle.",
  "Mix/ Daily": "Cotton, synthetic and easy-care garments. Not suitable for silk, delicates, dark clothes, wool or duvets.",
  "Mix/Daily 60’": "Cotton, synthetic and easy-care garments with moderate soiling. Extended 60-minute cycle for a deeper clean.",
  "Mixed": "Versatile programme for a mixed load of cotton, synthetic and easy-care fabrics.",
  "Mixed Soiled +": "Mixed load of cotton, synthetic or easy-care garments with heavier soiling.",
  "Mixed Soiled/Mixed Solid": "Mixed fabric load for moderately to heavily soiled garments of various fabric types.",
  "Mixed/Soiled": "Mixed fabric load for normally soiled everyday clothing.",
  "Power Steam*": "Steam-assisted wash for germ-free, softer and better-smelling clothes.",
  "PowerStream": "Powerful water stream action for deep penetration and effective cleaning.",
  "Synthetic/ Daily": "Synthetic and easy-care fabrics for daily wear. Gentle drum action protects fibre texture.",
  "Synthetic/Daily": "Synthetic and easy-care fabrics for daily wear. Gentle drum action protects fibre texture.",
  "Uniform/Linen": "Cotton colour-fast work uniforms, household linen, bed sheets and table linen.",
  "Uniform/Linen/Cotton coloured's/cotton whites": "Combined cycle for uniforms, linen, coloured and white cotton items.",
  "Woollens": "Machine washable woollen garments — gentle drum action and cool temperatures preserve natural wool properties.",
  "2D Wash": "Two-directional water jets ensure thorough detergent mixing and rinsing.",
  "2D Shower System": "Dual shower nozzles spray water evenly for complete soaking and rinsing.",
  "2D/3D Wash": "Combined 2D or 3D wash system depending on load size for thorough cleaning.",
  "3D Wash": "3D dynamic water jets and drum rotation dissolve detergent, loosen tough dirt and rinse it away.",
  "3D Wash System": "3D dynamic water jets and drum rotation work together for a deep, thorough clean.",
  "3D/4D Wash": "Combined 3D or 4D wash system depending on model for superior deep cleaning.",
  "4D Wash": "Jets of water and paddle showers ensure complete soaking — detergent solution penetrates every fibre.",
  "7 Swirl": "Seven-directional swirl wash action for thorough dirt removal from all fabric angles.",
  "7 Swirl Wash": "Seven-directional swirl wash for thorough cleaning of everyday fabrics.",
  "7 Swirl Powered by Ai": "AI-optimised seven-directional swirl wash for efficient, fabric-safe cleaning.",
  "9 Swirl": "Nine-directional swirl wash action for superior dirt removal across all fabric surfaces.",
  "9 Swirl Wash": "Nine-directional swirl wash for superior cleaning across all fabric surfaces.",
  "9 Swirl Powered by Ai": "AI-optimised nine-directional swirl wash for best-in-class cleaning performance.",
  "9 Swirl®": "Registered IFB technology — nine-directional swirl wash for deep fabric cleaning.",
  "Ai Dos": "Automatically dispenses the correct amount of detergent based on load weight and soil level.",
  "AI Dos": "Automatically dispenses the correct amount of detergent based on load weight and soil level.",
  "Air Bubble Wash": "Millions of fine air bubbles penetrate fabric fibres to loosen and lift dirt gently.",
  "Air Bubble Wash System": "Fine air bubbles combined with water action gently but effectively remove dirt from fabrics.",
  "Air-Bubble Wash": "Fine air bubbles penetrate fabric fibres to loosen and lift stubborn dirt gently.",
  "Anti Crease": "Periodically rotates the drum after the wash cycle ends to prevent wrinkles from setting.",
  "Aqua Energie": "Energises water molecules to carry detergent deep into fabric fibres for a thorough wash.",
  "Aqua Energy": "Energises water molecules to carry detergent deep into fabric fibres for a thorough wash.",
  "Aqua Restart": "Automatically resumes the wash cycle from where it stopped after a power interruption.",
  "Auto Balance System": "Automatically senses and redistributes unbalanced laundry for a stable spin cycle.",
  "Auto Foam Control System": "Detects excess foam and automatically adds an extra rinse to remove it completely.",
  "Auto Imbalance System": "Automatically detects and corrects load imbalance by redistributing clothes for a stable spin.",
  "Auto Restart": "Resumes the wash cycle automatically after a power failure.",
  "Auto Tub Clean": "Runs a drum-cleaning cycle to remove impurities, bacteria and odours automatically.",
  "BLDC Motor Technology": "Brushless DC motor delivers high efficiency, low noise, minimal vibration and longer motor life.",
  "Child Lock": "Locks the control panel to prevent children from accidentally changing settings.",
  "Cool Down Cycle": "Gradually reduces wash temperature at cycle end to protect heat-sensitive fabrics.",
  "Crescent Moon Drum": "The crescent moon drum design cushions clothes with water to protect fabric integrity.",
  "Drum Lamp": "LED light inside the drum for easy loading and unloading in low-light conditions.",
  "High-Low Voltage Protection": "Stops the program if voltage drops below 165V or exceeds 270V to protect machine components.",
  "Hot Rinse": "Rinses laundry in warm water for more effective removal of detergent residue and allergens.",
  "Inbuilt Easy Iron": "Uses steam and controlled tumbling to reduce creases, making clothes easier to iron.",
  "Laundry Add": "Pause the cycle in the early stage to add forgotten garments, then resume without restarting.",
  "Laundry Add Option": "Allows adding forgotten items during the early stage of the wash cycle.",
  "Oxyjet Technology": "Oxygen-infused water jets penetrate fabric fibres to lift stains and refresh garments.",
  "Oxyjet® Technology": "Registered IFB technology — oxygen-infused jets for deep stain lifting and fabric refreshing.",
  "Powered by Ai": "AI-driven sensing detects load, optimises water level and selects the best wash program automatically.",
  "Powered by AI": "AI-driven sensing detects load, optimises water level and selects the best wash program automatically.",
  "Pre Wash": "An initial soak and rinse before the main wash — ideal for heavily soiled garments.",
  "Program Memory Backup": "Remembers the exact cycle position and resumes after a power failure without wasting water or time.",
  "Quick Wash": "Quick wash for small loads of lightly soiled garments.",
  "Rapid Wash": "A quick wash cycle for small lightly soiled loads when time is short.",
  "Start/Pause": "Pause mid-cycle to add forgotten laundry, then resume without restarting.",
  "Start/Pause (Program Interrupt)": "Pause the cycle at any point to add or remove garments, then resume seamlessly.",
  "Start/Pause Program Interrupt": "Pause the running cycle to add or remove laundry, then continue from exactly where it stopped.",
  "Steam Wash": "Steam injected during the wash for deeper cleaning, better stain removal and fresher clothes.",
  "Technology": "Proprietary IFB wash technology integrated into this model for enhanced cleaning performance.",
  "Baby Wear (7 Kg/8 Kg)": "High-temperature wash with extra rinses for baby clothes — available on 7 and 8 kg models.",
  "Blankets": "Dedicated cycle for machine washable blankets with enhanced wash movement.",
  "Blankets (Curtain/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "Blankets(Curtain/Bulky)": "Stronger wash movement for blankets, curtains and bulky items.",
  "Bulky": "Machine washable oversized items like blankets and bedding covers.",
  "Delicates": "Gentle wash for woollens, silk, and delicate garments.",
  "Express": "Quick cycle for small lightly soiled loads.",
  "Express 30°": "Lightly soiled laundry washed at 30°C in 30 minutes.",
  "Favourite (SDSG 7 Kg/SSG 8 Kg)": "Save preferred wash settings — available on SDSG 7 kg and SSG 8 kg models.",
  "Hygiene+": "Enhanced sanitising cycle with higher temperature and extra rinse for thorough germ removal.",
  "My Cycle (7 Kg/8 Kg)": "Save and reuse preferred wash settings — available on 7 and 8 kg models.",
  "Only Rinse": "Standalone rinse cycle for freshening clothes or removing detergent residue.",
  "Only Spin": "Standalone spin cycle to extract water from already-washed laundry.",
  "Rinse + Spin": "Combined rinse and spin cycle for quick freshening of lightly soiled clothes.",
  "Rinse+Spin": "Combined rinse and spin for removing detergent residue or quick freshening.",
  "STAINFIGHTER™": "Uses high water temperature to remove tough stains effectively.",
  "Sari": "Gentle program for machine washable sarees to prevent damage to delicate fabric.",
  "Silent (SDSG 7 Kg/SSG 8 Kg)": "Quieter operation mode — available on SDSG 7 kg and SSG 8 kg models.",
  "Smart Sense + Wash + Rinse": "Smart Sense with Wash and Rinse LEDs active — auto-detects load and optimises full cycle.",
  "Smart Sense*": "Intelligent load-sensing program that auto-adjusts water level and wash time.",
  "Spin": "Standalone high-speed spin to extract maximum water from washed laundry.",
  "StainFighterTM": "Uses high water temperature to remove tough stains effectively.",
  "Uniform": "Cotton colour-fast work uniforms, shirts and school wear.",
  "Wash + Rinse": "Combined wash and rinse cycle without a final spin.",
  "Ai": "AI-based sensing that detects load, optimises water level and selects the ideal wash program.",
  "Auto Tub clean": "Automatically cleans the tub to prevent bacteria, mould and odour build-up.",
  "DeepClean Powered by Ai": "AI-powered deep cleaning that senses load and optimises wash parameters for maximum stain removal.",
  "Delay": "Delays the start of the wash cycle to a preferred later time for scheduling convenience.",
  "In-built heater": "Heats water to the selected temperature for better stain removal and allergen elimination.",
  "Tub Clean Wash": "Dedicated wash cycle for cleaning the drum, removing detergent residue, bacteria and bad odours.",
  "Aroma.": "A refreshing cycle that uses fragrance to leave clothes smelling fresh after washing.",
  "Cupboard Dry / Eco Dry": "Cupboard Dry removes all moisture for immediate storage; Eco Dry uses less energy for lightly damp clothes."
};
  const DRYER_DESC = {
  "Mixed Load": "Mixture of Loads (Iron Dry 90 min, Cupboard Dry 120 min)",
  "Cotton": "Heavier items such as towels and flannel blankets ( Refresh Cycle: 20 mins, Iron Dry :140 mins, Cupboard Dry: 160 mins).",
  "Synthetics": "Delicate fabrics prone to shrinkage such as lingerie, synthetics etc  (Iron Dry :50 mins, Cupboard Dry: 70 mins).",
  "Anticrease": "The clothes dryer has been programmed to rotate in one direction for 3 minutes and then in the other direction for 3 minutes. This reduces tangling and ensures even drying in a shorter time.",
  "Safety Reset": "A temperature activated safety cut-off device protects the clothes dryer from overheating. A safety reset switch located near the door latch activates the safety device.",
  "Lint Filter": "Captures lint and fabric fibres from clothes during drying to maintain drying efficiency and prevent lint buildup inside the machine.",
  "Safety Door Switch": "Automatically stops dryer operation when the door is opened to ensure user safety during operation.",
  "Auto Cooldown": "Continues airflow after the drying cycle to cool down clothes and internal components for safer handling and wrinkle reduction.",
  "Adjustable Feet": "Allows height adjustment for proper machine levelling and stable operation on uneven surfaces.",
  "Reversible Badge": "Enables the control panel/badge orientation to be adjusted when the dryer is wall mounted in different positions.",
  "Wall Mounting Kit": "Accessories provided to safely mount the dryer on a wall for space-saving installation.",
  "Venting Kit": "Helps exhaust hot and moist air from the dryer to the outside environment for efficient drying performance.",
  "Levelling Kit": "Assists in balancing and stabilising the dryer during installation to minimise vibration and movement.",
  "Manual Safety Cut-off Switch": "Protective safety mechanism that allows manual interruption of power supply during unsafe operating conditions."
};
  const DESC_MAP = { front: FL_DESC, top: TL_DESC, topload: TL_DESC, wdr: WDR_DESC, dryer: DRYER_DESC };

const TYPES = [
  { id: 'front', label: 'Front Load',  emoji: '🟢', ph: 'Search Front Load model… e.g. Senator Neo, Eva ZX'  },
  { id: 'top',   label: 'Top Load',    emoji: '🔵', ph: 'Search Top Load model… e.g. TL-RBR, TL-R1WRS'     },
  { id: 'wdr',   label: 'WDR',         emoji: '🔴', ph: 'Search WDR model… e.g. Executive Plus ZXB'         },
  { id: 'dryer', label: 'Dryer',       emoji: '🟠', ph: 'Search Dryer model… e.g. Turbo Dry LX'              },
  { id: 'dw',    label: 'Dishwasher',  emoji: '🍽️', ph: 'Search Dishwasher model… e.g. Neptune VX, Neptune SX2' },
];
  let activeType = 'front';

  const overlay   = document.getElementById('modelOverlay');
  const closeBtn  = document.getElementById('modelOverlayClose');
  const titleEl   = document.getElementById('modelOverlayTitle');
  const tabsEl    = document.getElementById('modelTabs');
  const bodyEl    = document.getElementById('modelTabBody');
  const pillWrap  = document.getElementById('mlPillWrap');
  const searchIn  = document.getElementById('mlSearchInput');
  const searchBtn = document.getElementById('mlSearchBtn');
  const suggestBx = document.getElementById('mlSuggestions');

  if (!pillWrap || !searchIn) { console.error('[ML] DOM elements missing.'); return; }

  /* ── Pills ── */
  function renderPills() {
    pillWrap.innerHTML = TYPES.map(t =>
      `<button class="ml-pill${t.id === activeType ? ' active' : ''}" data-type="${t.id}">${t.emoji} ${t.label}</button>`
    ).join('');
  }
  pillWrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-type]');
    if (!btn) return;
    activeType = btn.dataset.type;
    renderPills();
    searchIn.placeholder = TYPES.find(t => t.id === activeType).ph;
    searchIn.value = '';
    suggestHide();
    searchIn.focus();
  });
  renderPills();
  searchIn.placeholder = TYPES[0].ph;

  /* ── Tooltip ── */
  const tooltip = document.createElement('div');
  tooltip.id = 'mlInfoTooltip';
  tooltip.innerHTML = '<div class="ml-info-tooltip-title"></div><div class="ml-info-tooltip-body"></div>';
  document.body.appendChild(tooltip);
  let activeTipBtn = null;

  function showTooltip(btn, title, text) {
    tooltip.querySelector('.ml-info-tooltip-title').textContent = title;
    tooltip.querySelector('.ml-info-tooltip-body').textContent  = text;
    tooltip.classList.add('visible');
    const r  = btn.getBoundingClientRect();
    const tw = tooltip.offsetWidth  || 280;
    const th = tooltip.offsetHeight || 80;
    let left = r.left + window.scrollX;
    let top  = r.bottom + window.scrollY + 6;
    if (left + tw > window.innerWidth - 12) left = window.innerWidth - tw - 12;
    if (left < 8) left = 8;
    if (top + th > window.innerHeight + window.scrollY - 12) top = r.top + window.scrollY - th - 6;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
    activeTipBtn = btn;
  }
  function hideTooltip() { tooltip.classList.remove('visible'); activeTipBtn = null; }
  document.addEventListener('click', e => {
    if (!e.target.closest('.ml-info-btn') && !e.target.closest('#mlInfoTooltip')) hideTooltip();
  });

  /* ── Helpers ── */
  function fmtCurrency(v) {
    if (!v && v !== 0) return '—';
    return '₹ ' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
  function infoBtn(name, dm) {
    if (!dm[name]) return '';
    return '<button class="ml-info-btn" data-name="' + name.replace(/"/g, '&quot;') + '" title="' + name.replace(/"/g, '&quot;') + '">ⓘ</button>';
  }
  function typeBadge(type) {
    const t   = TYPES.find(x => x.id === type);
    const cls = { front: 'ml-badge-front', top: 'ml-badge-top', topload: 'ml-badge-top', wdr: 'ml-badge-wdr', dryer: 'ml-badge-dryer' };
    return t ? '<span class="ml-type-badge ' + (cls[type] || '') + '">' + t.emoji + ' ' + t.label + '</span>' : '';
  }

  /* ── Renderers ── */
  function renderPrograms(d, dm) {
    if (!d.programs || !d.programs.length) return '<p class="ml-empty">No program data.</p>';
    return '<div class="ml-chip-grid">' + d.programs.map(function(p) {
      return '<span class="ml-chip-wrap"><span class="ml-chip">' + p + '</span>' + infoBtn(p, dm) + '</span>';
    }).join('') + '</div>';
  }
  function renderFeatures(d, dm) {
    const kf   = d.keyFeatures || {};
    const secs = [
      { title: 'Advanced Wash Technology', key: 'Advanced Wash Technology' },
      { title: 'Machine Care',       key: 'Machine Care'             },
      { title: 'User Convenience',         key: 'User Convenience'         },
    ];
    const html = secs.map(function(s) {
      const items = kf[s.key] || [];
      if (!items.length) return '';
      return '<div class="ml-feature-section"><div class="ml-feature-title">' + s.title + '</div>'
           + '<div class="ml-chip-grid">' + items.map(function(i) {
               return '<span class="ml-chip-wrap"><span class="ml-chip ml-chip-feat">' + i + '</span>' + infoBtn(i, dm) + '</span>';
             }).join('') + '</div></div>';
    }).join('');
    return html || '<p class="ml-empty">No feature data.</p>';
  }
  function renderNom(d) {
    const e = Object.entries(d.nomenclature || {});
    if (!e.length) return '<p class="ml-empty">No nomenclature data.</p>';
    return '<div class="ml-nom-grid">' + e.map(function(pair) {
      return '<div class="ml-nom-card"><div class="ml-nom-code">' + pair[0] + '</div>'
           + '<div class="ml-nom-arrow">→</div>'
           + '<div class="ml-nom-meaning">' + pair[1] + '</div></div>';
    }).join('') + '</div>';
  }
  function renderAMC(d) {
    const e = Object.entries(d.amcEw || {});
    if (!e.length) return '<p class="ml-empty">No AMC / EW data.</p>';
    return '<div class="ml-amc-table">'
         + '<div class="ml-amc-header"><span>Plan</span><span>Value</span></div>'
         + e.map(function(pair) {
             return '<div class="ml-amc-row">'
                  + '<span class="ml-amc-plan">' + pair[0] + '</span>'
                  + '<span class="ml-amc-val">'  + fmtCurrency(pair[1]) + '</span>'
                  + '</div>';
           }).join('')
         + '</div>';
  }
  function renderTest(d) {
    const t = d.testMode || {};
    if (!Object.keys(t).length) return '<p class="ml-empty">No test mode data for this model.</p>';
    return '<div class="ml-testmode">'
         + [
             { label: '1. Program Position', value: t.Program_Position || '—' },
             { label: '2. Press Button',     value: t.Test_Mode_Button || '—' },
             { label: '3. Display Shows',    value: t.Display_Shows    || '—' },
           ].map(function(s) {
             return '<div class="ml-testmode-step">'
                  + '<div class="ml-testmode-label">' + s.label + '</div>'
                  + '<div class="ml-testmode-value">' + s.value + '</div>'
                  + '</div>';
           }).join('')
         + '</div>';
  }

  /* ── Info btn delegation ── */
  let activeDM = {};
  bodyEl.addEventListener('click', function(e) {
    const b = e.target.closest('.ml-info-btn');
    if (!b) return;
    e.stopPropagation();
    if (activeTipBtn === b) { hideTooltip(); return; }
    const desc = activeDM[b.dataset.name];
    if (desc) showTooltip(b, b.dataset.name, desc);
  });

  /* ── Overlay ── */
  const TABS = [
    { id: 'programs',     label: 'Programs'     },
    { id: 'features',     label: 'Key Features' },
    { id: 'nomenclature', label: 'Nomenclature' },
    { id: 'amc',          label: 'AMC / EW'     },
    { id: 'testmode',     label: 'Test Mode'    },
  ];
  let curData = null, curTab = 'programs';

  function getRenderer(id, d, dm) {
    if (id === 'programs')     return renderPrograms(d, dm);
    if (id === 'features')     return renderFeatures(d, dm);
    if (id === 'nomenclature') return renderNom(d);
    if (id === 'amc')          return renderAMC(d);
    if (id === 'testmode')     return renderTest(d);
    return '';
  }

  function openOverlay(obj) {
    curData  = obj;
    curTab   = 'programs';
    activeDM = DESC_MAP[obj.type] || (typeof DW_DESC !== 'undefined' && obj.type === 'dw' ? DW_DESC : {});
    titleEl.innerHTML = obj.model + ' ' + typeBadge(obj.type);
    tabsEl.innerHTML  = TABS.map(function(t) {
      return '<button class="ml-tab' + (t.id === curTab ? ' active' : '') + '" data-tab="' + t.id + '">' + t.label + '</button>';
    }).join('');
    bodyEl.innerHTML = renderPrograms(obj, activeDM);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  tabsEl.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-tab]');
    if (!btn || !curData) return;
    hideTooltip();
    curTab = btn.dataset.tab;
    tabsEl.querySelectorAll('.ml-tab').forEach(function(t) {
      t.classList.toggle('active', t.dataset.tab === curTab);
    });
    bodyEl.innerHTML = getRenderer(curTab, curData, activeDM);
  });

  function closeOverlay() {
    hideTooltip();
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    curData = null;
  }
  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { hideTooltip(); closeOverlay(); } });

  /* ── Search ── */
  let sugList = [], sugTimer;

  function suggestShow() {
    if (!sugList.length) { suggestHide(); return; }
    suggestBx.innerHTML = sugList.slice(0, 8).map(function(m, i) {
      return '<div class="ml-suggest-item" data-idx="' + i + '">' + m.model + '</div>';
    }).join('');
    suggestBx.style.display = 'block';
  }
  function suggestHide() { suggestBx.style.display = 'none'; sugList = []; }

  async function doFetch(q) {
    if (q.length < 2) { suggestHide(); return; }
    try {
      const r = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=' + activeType);
      if (!r.ok) { suggestHide(); return; }
      const d = await r.json();
      sugList = d.results || [];
      suggestShow();
    } catch (err) { suggestHide(); }
  }

  async function doSearch() {
    const q = searchIn.value.trim();
    if (q.length < 2) return;
    suggestHide();
    try {
      const r = await fetch('/api/model?q=' + encodeURIComponent(q) + '&type=' + activeType);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      if (d.results && d.results.length) {
        openOverlay(d.results[0]);
      } else {
        const t = TYPES.find(function(x) { return x.id === activeType; });
        titleEl.textContent = 'No model found';
        tabsEl.innerHTML    = '';
        bodyEl.innerHTML    = '<p class="ml-empty">No ' + t.label + ' results for “<strong>' + q + '</strong>”.</p>';
        overlay.classList.add('open');
      }
    } catch (err) { console.error('[ML]', err); }
  }

  suggestBx.addEventListener('mousedown', function(e) {
    e.preventDefault();
    const item = e.target.closest('[data-idx]');
    if (!item) return;
    const m = sugList[parseInt(item.dataset.idx)];
    if (m) { searchIn.value = m.model; suggestHide(); openOverlay(m); }
  });
  searchIn.addEventListener('input',   function() { clearTimeout(sugTimer); sugTimer = setTimeout(function() { doFetch(searchIn.value.trim()); }, 280); });
  searchIn.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } if (e.key === 'Escape') suggestHide(); });
  searchIn.addEventListener('blur',    function() { setTimeout(suggestHide, 150); });
  searchBtn.addEventListener('click',  doSearch);

  console.log('[ML] model-lookup.js ready ✅');
})();
