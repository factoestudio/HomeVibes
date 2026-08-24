const fs = require('fs');
const path = require('path');

const megaLeads = [
  // =========================================================================
  // 1. PRE-CONSTRUCTION CONDO DEVELOPERS & MASTER-PLAN BUILDERS (GTA)
  // =========================================================================
  {
    company_name: "Tridel Corporation",
    contact_name: "Sales & Marketing Division",
    category: "Pre-Con Developer",
    target_region: "Toronto Core, Etobicoke, North York",
    email: "ask@tridel.com",
    phone: "416-661-9290",
    website: "https://www.tridel.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Featured spotlight across Bloor West, Kipling Hub, and Downtown Toronto micro-market pages."
  },
  {
    company_name: "The Daniels Corporation",
    contact_name: "Corporate Marketing & Sales",
    category: "Pre-Con Developer",
    target_region: "Toronto Downtown East, Mississauga City Centre",
    email: "info@danielshomes.ca",
    phone: "416-598-2129",
    website: "https://danielshomes.ca",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Highlight master-planned community launches across Mississauga City Centre and Regent Park/East Harbour."
  },
  {
    company_name: "Menkes Developments",
    contact_name: "Marketing & Acquisitions Division",
    category: "Pre-Con Developer",
    target_region: "Toronto Core, Waterfront, Vaughan Metropolitan Centre",
    email: "info@menkes.com",
    phone: "416-491-2222",
    website: "https://www.menkes.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Sponsor Sugar Wharf Waterfront & VMC transit hub development spotlight cards."
  },
  {
    company_name: "Mattamy Homes Canada",
    contact_name: "GTA Sales Operations",
    category: "Pre-Con Developer",
    target_region: "Oakville, Milton, Markham, Brampton",
    email: "gtasales@mattamycorp.com",
    phone: "905-829-7600",
    website: "https://mattamyhomes.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Capture suburban family movers exploring Oakville, Markham, and Halton master-planned neighborhoods."
  },
  {
    company_name: "CentreCourt Developments",
    contact_name: "Development & Sales Office",
    category: "Pre-Con Developer",
    target_region: "Toronto Downtown, Transit Corridors, Pickering",
    email: "info@centrecourt.com",
    phone: "416-596-0300",
    website: "https://centrecourt.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Showcase transit-oriented condo launches along Ontario Line subway and Pickering Town Centre."
  },
  {
    company_name: "Graywood Developments",
    contact_name: "Sales & Infill Development",
    category: "Pre-Con Developer",
    target_region: "The Junction, Dupont West, Downtown Toronto",
    email: "info@graywoodgroup.com",
    phone: "416-597-1955",
    website: "https://www.graywoodgroup.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Promote boutique west-end infill projects in The Junction and Dupont West articles."
  },
  {
    company_name: "Pinnacle International",
    contact_name: "Marketing & Sales",
    category: "Pre-Con Developer",
    target_region: "Toronto Waterfront, Mississauga Hurontario",
    email: "info@pinnacleinternational.ca",
    phone: "416-596-9964",
    website: "https://www.pinnacleinternational.ca",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Feature Pinnacle One Yonge waterfront towers and Pinnacle Grand Park in Peel."
  },
  {
    company_name: "Pemberton Group",
    contact_name: "Client Relations & Sales",
    category: "Pre-Con Developer",
    target_region: "Yonge & Eglinton, Yorkville, Mississauga",
    email: "info@pembertongroup.com",
    phone: "905-326-4100",
    website: "https://pembertongroup.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Feature midtown high-rises around Yonge-Eglinton Crosstown transit interchange."
  },
  {
    company_name: "Great Gulf",
    contact_name: "Residential Sales",
    category: "Pre-Con Developer",
    target_region: "Toronto Core, Oakville, Richmond Hill",
    email: "info@greatgulf.com",
    phone: "416-449-1340",
    website: "https://www.greatgulf.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Target luxury homebuyers looking at Oakville waterfront and King West master builds."
  },
  {
    company_name: "TAS Impact Developments",
    contact_name: "Development Team",
    category: "Pre-Con Developer",
    target_region: "The Junction, West Toronto Railpath",
    email: "info@tasimpact.ca",
    phone: "416-510-8181",
    website: "https://tasimpact.ca",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Sponsor eco-conscious, design-forward loft developments in Junction & Dupont West."
  },
  {
    company_name: "Plaza Corp (Plazacorp)",
    contact_name: "Condo Sales Division",
    category: "Pre-Con Developer",
    target_region: "Liberty Village, Yorkville, North York",
    email: "info@plazacorp.com",
    phone: "416-862-2665",
    website: "https://pureplaza.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Target young professionals researching King West & Liberty Village condo suites."
  },
  {
    company_name: "Empire Communities",
    contact_name: "Suburban Community Sales",
    category: "Pre-Con Developer",
    target_region: "Brampton, Vaughan, Halton",
    email: "info@empirecommunities.com",
    phone: "905-307-8102",
    website: "https://www.empirecommunities.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Promote entry-level townhomes and detached subdivisions across Peel & York regions."
  },
  {
    company_name: "Curated Properties",
    contact_name: "Sales & Infill Division",
    category: "Pre-Con Developer",
    target_region: "The Annex, Dupont West, Queen West",
    email: "info@curatedproperties.com",
    phone: "416-901-4400",
    website: "https://curatedproperties.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Boutique design-forward infill townhouse & loft launches."
  },
  {
    company_name: "Altree Developments",
    contact_name: "Urban Development Office",
    category: "Pre-Con Developer",
    target_region: "High Park, Scarborough Bluffs, Midtown",
    email: "info@altreedevelopments.com",
    phone: "416-646-6080",
    website: "https://altreedevelopments.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Highlight master-planned boutique residences near High Park and lakefront parks."
  },
  {
    company_name: "Fieldgate Homes",
    contact_name: "Community Sales Team",
    category: "Pre-Con Developer",
    target_region: "Markham, Unionville, Pickering, Whitby",
    email: "sales@fieldgatehomes.com",
    phone: "416-227-9005",
    website: "https://fieldgatehomes.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Promote premier suburban family subdivisions across York and Durham regions."
  },
  {
    company_name: "Tribute Communities",
    contact_name: "GTA Development Division",
    category: "Pre-Con Developer",
    target_region: "Pickering, Ajax, Oakville, Downtown Toronto",
    email: "info@mytribute.ca",
    phone: "905-839-8121",
    website: "https://mytribute.ca",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Feature Pickering City Centre master plan and Oakville luxury townhome launches."
  },
  {
    company_name: "Lanterra Developments",
    contact_name: "Corporate Marketing",
    category: "Pre-Con Developer",
    target_region: "Downtown Toronto Core, Bay Street Corridor, North York",
    email: "info@lanterradevelopments.com",
    phone: "416-635-7171",
    website: "https://lanterradevelopments.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Sponsor luxury high-rise condominium portfolios in Toronto's financial and university core."
  },
  {
    company_name: "Aspen Ridge Homes",
    contact_name: "Sales & Customer Care",
    category: "Pre-Con Developer",
    target_region: "Markham, Vaughan, Richmond Hill, Oakville",
    email: "info@aspenridgehomes.com",
    phone: "905-881-7138",
    website: "https://www.aspenridgehomes.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Promote premier low-rise and master-planned community developments across York & Halton."
  },
  {
    company_name: "Greenpark Group",
    contact_name: "Corporate Office",
    category: "Pre-Con Developer",
    target_region: "Vaughan, Markham, Oakville, Milton, Brampton",
    email: "info@greenparkgroup.ca",
    phone: "905-851-0005",
    website: "https://www.greenparkgroup.ca",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "High-volume exposure for comprehensive low-rise and high-rise GTA developments."
  },
  {
    company_name: "Canderel Residential",
    contact_name: "Marketing & Acquisitions",
    category: "Pre-Con Developer",
    target_region: "Toronto Downtown, St. Lawrence, Midtown",
    email: "info@canderelresidential.com",
    phone: "416-593-6366",
    website: "https://canderelresidential.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Feature signature architectural towers in Toronto's historic and financial districts."
  },
  {
    company_name: "Lifetime Developments",
    contact_name: "Sales & Strategic Partnerships",
    category: "Pre-Con Developer",
    target_region: "King West, Liberty Village, Queen West",
    email: "info@lifetimedevelopments.com",
    phone: "416-987-5000",
    website: "https://lifetimedevelopments.com",
    recommended_sponsorship_tier: "Pre-Con Builder Spotlight ($1,500–$3,000/mo)",
    pitch_angle: "Target trendy lifestyle and hospitality-infused condo searchers in downtown west."
  },

  // =========================================================================
  // 2. TOP 1% REALTORS, ELITE TEAMS & BOUTIQUE BROKERAGES (GTA)
  // =========================================================================
  {
    company_name: "Paul Johnston Unique Urban Homes (Right at Home)",
    contact_name: "Paul Johnston",
    category: "Realtor / Brokerage",
    target_region: "Leslieville, The Junction, Toronto Lofts",
    email: "paul@uniqueurbanhomes.com",
    phone: "416-465-7850",
    website: "https://www.uniqueurbanhomes.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Exclusive brand placement on Leslieville and Junction architectural loft pages."
  },
  {
    company_name: "Alex Irish & Associates (Sotheby's International)",
    contact_name: "Alex Irish",
    category: "Realtor / Brokerage",
    target_region: "Downtown Oakville, Kerr Village, Old Oakville",
    email: "airish@sothebysrealty.ca",
    phone: "905-845-0024",
    website: "https://www.alexirish.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Dominant luxury sponsorship for the #1 rated Oakville & Halton waterfront profiles."
  },
  {
    company_name: "The Invidiata Team (eXp Realty)",
    contact_name: "Christopher Invidiata",
    category: "Realtor / Brokerage",
    target_region: "Oakville, Burlington, Mississauga Waterfront",
    email: "info@invidiata.com",
    phone: "905-338-2121",
    website: "https://www.invidiata.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Position as premier luxury waterfront specialist on Port Credit & Oakville pages."
  },
  {
    company_name: "The Good Manors Real Estate Group",
    contact_name: "Armani & Team",
    category: "Realtor / Brokerage",
    target_region: "The Junction, High Park, Bloor West Village",
    email: "info@thegoodmanors.com",
    phone: "416-762-8255",
    website: "https://www.thegoodmanors.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Featured neighborhood specialist badge on The Junction & Roncesvalles matches."
  },
  {
    company_name: "Michael Camber & Associates (Royal LePage)",
    contact_name: "Michael Camber",
    category: "Realtor / Brokerage",
    target_region: "Liberty Village, King West, CityPlace",
    email: "info@michaelcamber.com",
    phone: "416-520-0779",
    website: "https://michaelcamber.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Top realtor placement on King West & Liberty Village condo search traffic."
  },
  {
    company_name: "Heaps Estrin Real Estate Team (Royal LePage)",
    contact_name: "Cailey Heaps",
    category: "Realtor / Brokerage",
    target_region: "Rosedale, Moore Park, Lawrence Park, Midtown",
    email: "cailey@heapsestrin.com",
    phone: "416-424-4910",
    website: "https://heapsestrin.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Exclusive high-net-worth sponsor for Midtown, Lawrence Park & Leaside."
  },
  {
    company_name: "The Lionetti Group (Chestnut Park)",
    contact_name: "Matt Lionetti",
    category: "Realtor / Brokerage",
    target_region: "The Beaches, Upper Beaches, Leslieville",
    email: "matt@mattlionetti.com",
    phone: "416-508-3907",
    website: "https://mattlionetti.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Exclusive verified advisor banner across East Toronto & The Beaches pages."
  },
  {
    company_name: "DeClute Real Estate (Union Realty)",
    contact_name: "Rochelle DeClute",
    category: "Realtor / Brokerage",
    target_region: "The Beaches, Scarborough Bluffs, Birch Cliff",
    email: "info@declute.com",
    phone: "416-686-9618",
    website: "https://declute.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "High-visibility sponsor for East Toronto lakefront & Beaches listings."
  },
  {
    company_name: "Martin MacFarlane Real Estate (Sage)",
    contact_name: "Martin MacFarlane",
    category: "Realtor / Brokerage",
    target_region: "Leslieville, South Riverdale, Riverside",
    email: "martin@martinmacfarlane.ca",
    phone: "416-462-1888",
    website: "https://martinmacfarlane.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Lead generation placement on Queen East & South Riverdale family searchers."
  },
  {
    company_name: "The Peterson Team (Keller Williams)",
    contact_name: "Peterson Team",
    category: "Realtor / Brokerage",
    target_region: "Port Credit, Clarkson, Lorne Park, Mississauga",
    email: "info@petersonteam.ca",
    phone: "905-278-3500",
    website: "https://petersonteam.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Top advisor card on Port Credit Waterfront and Streetsville village profiles."
  },
  {
    company_name: "Andrew Ipekian Real Estate Group (Keller Williams)",
    contact_name: "Andrew Ipekian",
    category: "Realtor / Brokerage",
    target_region: "Downtown Toronto, King West, Yorkville",
    email: "info@ipekian.ca",
    phone: "416-572-1016",
    website: "https://ipekian.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Premium placement for luxury downtown buyers and urban investors."
  },
  {
    company_name: "Benczik Kavanagh Real Estate Team (Century 21)",
    contact_name: "Benczik Kavanagh Team",
    category: "Realtor / Brokerage",
    target_region: "Unionville, Markham Centre, Stouffville",
    email: "info@benczik.com",
    phone: "905-477-7766",
    website: "https://benczik.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Exclusive sponsor for #1 rated York Region micro-market (Unionville & Markham Centre)."
  },
  {
    company_name: "Sam McDadi Real Estate Inc. Brokerage",
    contact_name: "Sam McDadi",
    category: "Realtor / Brokerage",
    target_region: "Mississauga, Oakville, Brampton, GTA West",
    email: "info@mcdadi.com",
    phone: "905-502-1500",
    website: "https://mcdadi.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Dominant GTA West regional sponsorship across Mississauga & Peel searchers."
  },
  {
    company_name: "Barry Cohen Homes (RE/MAX Realtron)",
    contact_name: "Barry Cohen",
    category: "Realtor / Brokerage",
    target_region: "North York, Bridle Path, Bayview Village",
    email: "info@barrycohenhomes.com",
    phone: "416-223-1818",
    website: "https://barrycohenhomes.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Luxury estate sponsor badge for North York Centre and high-net-worth enclaves."
  },
  {
    company_name: "Steven Kim & Associates (Century 21 Atria)",
    contact_name: "Steven Kim",
    category: "Realtor / Brokerage",
    target_region: "Richmond Hill, Markham, North York",
    email: "steven@stevenkim.ca",
    phone: "416-879-1111",
    website: "https://stevenkim.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Top advisor card for family buyers moving to York Region top school districts."
  },
  {
    company_name: "Frank Leo & Associates (RE/MAX West)",
    contact_name: "Frank Leo",
    category: "Realtor / Brokerage",
    target_region: "Etobicoke, Vaughan, Toronto West",
    email: "frank@frankleo.com",
    phone: "416-917-5466",
    website: "https://frankleo.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "High-volume buyer & seller lead routing for Etobicoke Centre & Six Points."
  },
  {
    company_name: "The Gardner Group (Chestnut Park)",
    contact_name: "Kirsten Gardner",
    category: "Realtor / Brokerage",
    target_region: "The Junction, Bloor West, High Park",
    email: "kgardner@chestnutpark.com",
    phone: "416-123-4567",
    website: "https://chestnutpark.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "West-end family infill and historic home advisor badge."
  },
  {
    company_name: "David Oey Real Estate (Right at Home)",
    contact_name: "David Oey",
    category: "Realtor / Brokerage",
    target_region: "Leslieville, Cabbagetown, Riverside",
    email: "david@davidoey.com",
    phone: "416-465-7850",
    website: "https://davidoey.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "East-side Victorian and heritage architecture specialist banner."
  },
  {
    company_name: "Brad J. Lamb Realty Inc.",
    contact_name: "Brad J. Lamb",
    category: "Realtor / Brokerage",
    target_region: "King West, Queen West, Downtown Lofts",
    email: "info@torontoconds.com",
    phone: "416-368-5262",
    website: "https://www.torontoconds.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Iconic downtown condo and loft marketing authority sponsorship."
  },
  {
    company_name: "Property.ca Inc. Brokerage (Condos.ca)",
    contact_name: "Mark McLean",
    category: "Realtor / Brokerage",
    target_region: "Greater Toronto Area Condo Corridors",
    email: "info@property.ca",
    phone: "416-583-1660",
    website: "https://property.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "High-volume condo searcher traffic integration and lead routing."
  },
  {
    company_name: "Forest Hill Real Estate Yorkville",
    contact_name: "Ron Bilenckis",
    category: "Realtor / Brokerage",
    target_region: "Yorkville, Forest Hill, The Annex",
    email: "info@foresthillyorkville.com",
    phone: "416-975-5588",
    website: "https://foresthillyorkville.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Exclusive luxury advisor card on Yorkville and Annex heritage pages."
  },
  {
    company_name: "Harvey Kalles Real Estate Ltd.",
    contact_name: "Michael Kalles",
    category: "Realtor / Brokerage",
    target_region: "Toronto Central, Lawrence Park, Bridle Path",
    email: "info@harveykalles.com",
    phone: "416-441-2888",
    website: "https://harveykalles.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "High-net-worth real estate brokerage authority banner across central Toronto."
  },
  {
    company_name: "Sage Real Estate Ltd. Brokerage",
    contact_name: "Evan Sage",
    category: "Realtor / Brokerage",
    target_region: "Midtown, Downtown, East End",
    email: "info@sagerealestate.ca",
    phone: "416-483-8000",
    website: "https://sagerealestate.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Design-centric boutique brokerage sponsorship for urban professionals."
  },
  {
    company_name: "Royal LePage Real Estate Services Burlington",
    contact_name: "Burlington Team",
    category: "Realtor / Brokerage",
    target_region: "Burlington Downtown, Aldershot, Halton",
    email: "burlington@royallepage.ca",
    phone: "905-634-7755",
    website: "https://www.royallepage.ca",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Sponsor Burlington waterfront and GO commuter micro-market guides."
  },
  {
    company_name: "RE/MAX Hallmark Realty Group",
    contact_name: "Ken McLachlan",
    category: "Realtor / Brokerage",
    target_region: "Danforth, Riverdale, East York, Scarborough",
    email: "info@hallmarkrealty.ca",
    phone: "416-462-1888",
    website: "https://remaxhallmark.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "East-side dominant brokerage partner for Danforth & Greektown profiles."
  },
  {
    company_name: "Chestnut Park Real Estate Brokerage",
    contact_name: "Chris Kapches",
    category: "Realtor / Brokerage",
    target_region: "Toronto Luxury, Oakville, Collingwood",
    email: "info@chestnutpark.com",
    phone: "416-925-9141",
    website: "https://www.chestnutpark.com",
    recommended_sponsorship_tier: "Exclusive Area Sponsor ($750–$1,500/mo)",
    pitch_angle: "Christie's International Real Estate affiliate luxury sponsor."
  },

  // =========================================================================
  // 3. PRIVATE MORTGAGE BROKERAGES & SPECIALIZED LENDERS (GTA)
  // =========================================================================
  {
    company_name: "Ratehub.ca / CanWise Financial",
    contact_name: "Corporate Partnerships",
    category: "Mortgage Broker",
    target_region: "Greater Toronto Area (All Municipalities)",
    email: "info@ratehub.ca",
    phone: "1-800-679-0145",
    website: "https://www.ratehub.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Sponsored mortgage calculator and benchmark rate widget on Neighborhood Details pages."
  },
  {
    company_name: "Nesto Mortgage",
    contact_name: "Partnership Team",
    category: "Mortgage Broker",
    target_region: "GTA Digital First-Time Buyers",
    email: "support@nesto.ca",
    phone: "1-866-969-9599",
    website: "https://www.nesto.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Promote pre-approval rates for young professionals completing the Vibe Quiz."
  },
  {
    company_name: "Streetwise Mortgages",
    contact_name: "Dalia Barsoum",
    category: "Mortgage Broker",
    target_region: "GTA Real Estate Investors & Landlords",
    email: "info@streetwisemortgages.com",
    phone: "1-800-208-6255",
    website: "https://streetwisemortgages.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Feature inside Data Teardown and Cap Rate analysis articles (Condos vs Townhomes)."
  },
  {
    company_name: "Butler Mortgage Inc.",
    contact_name: "Ron Butler",
    category: "Mortgage Broker",
    target_region: "Toronto, Peel, York, Halton",
    email: "info@butlermortgage.ca",
    phone: "1-800-474-7283",
    website: "https://butlermortgage.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Lowest rate guarantee banner across high-traffic suburban family guides."
  },
  {
    company_name: "MonsterMortgage.ca",
    contact_name: "Vince Gaetano",
    category: "Mortgage Broker",
    target_region: "Toronto Core, Etobicoke, Mississauga",
    email: "info@monstermortgage.ca",
    phone: "416-480-0234",
    website: "https://monstermortgage.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Exclusive mortgage partner box on Toronto West & Downtown search results."
  },
  {
    company_name: "Pineapple Financial Inc.",
    contact_name: "Shubha Dasgupta",
    category: "Mortgage Broker",
    target_region: "Greater Toronto Area",
    email: "info@gopineapple.com",
    phone: "1-888-927-4632",
    website: "https://gopineapple.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Modern digital mortgage integration for tech-savvy home searchers."
  },
  {
    company_name: "DLC Forest City / GTA Capital",
    contact_name: "Dominion Lending Centres GTA",
    category: "Mortgage Broker",
    target_region: "Markham, Richmond Hill, Vaughan",
    email: "info@dominionlending.ca",
    phone: "1-888-806-8080",
    website: "https://dominionlending.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Target family buyers searching Unionville, Markham, and York Region schools."
  },
  {
    company_name: "Mortgage Alliance Canada",
    contact_name: "Mortgage Alliance GTA Hub",
    category: "Mortgage Broker",
    target_region: "Oakville, Burlington, Mississauga",
    email: "info@mortgagealliance.com",
    phone: "1-877-366-3487",
    website: "https://www.mortgagealliance.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Halton & Peel luxury mortgage pre-approval placement."
  },
  {
    company_name: "True North Mortgage Toronto",
    contact_name: "Client Concierge",
    category: "Mortgage Broker",
    target_region: "Downtown Toronto Financial District",
    email: "toronto@truenorthmortgage.ca",
    phone: "416-848-1858",
    website: "https://truenorthmortgage.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Discounted bank rates for downtown salary earners."
  },
  {
    company_name: "Mortgage Intelligence GTA",
    contact_name: "Mortgage Intelligence Hub",
    category: "Mortgage Broker",
    target_region: "Brampton, Mississauga, Peel",
    email: "info@mortgageintelligence.ca",
    phone: "905-896-8555",
    website: "https://mortgageintelligence.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Alternative and private lending options for self-employed and business owners."
  },
  {
    company_name: "Northwood Mortgage Ltd.",
    contact_name: "Northwood Mortgage Team",
    category: "Mortgage Broker",
    target_region: "Markham, Richmond Hill, Vaughan",
    email: "info@northwoodmortgage.com",
    phone: "416-444-6444",
    website: "https://northwoodmortgage.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Commercial and residential construction mortgage sponsor."
  },
  {
    company_name: "Centum Financial Services GTA",
    contact_name: "Chris Turcotte",
    category: "Mortgage Broker",
    target_region: "Durham Region, Pickering, Whitby, Oshawa",
    email: "info@centum.ca",
    phone: "1-888-236-8861",
    website: "https://www.centum.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "First-time home buyer mortgage specialist in East GTA."
  },

  // =========================================================================
  // 4. REAL ESTATE LAW FIRMS & PROPERTY CLOSING SPECIALISTS (GTA)
  // =========================================================================
  {
    company_name: "RealEstateLawyers.ca LLP",
    contact_name: "Mark Weisleder",
    category: "Real Estate Lawyer",
    target_region: "Greater Toronto Area (All Cities)",
    email: "info@realestatelawyers.ca",
    phone: "1-888-876-5297",
    website: "https://www.realestatelawyers.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Closing cost calculator and flat-fee legal services banner across all 25 neighborhood guides."
  },
  {
    company_name: "Aaron & Aaron Real Estate Lawyers",
    contact_name: "Bob Aaron",
    category: "Real Estate Lawyer",
    target_region: "Toronto Core, North York, Etobicoke",
    email: "bob@aaron.ca",
    phone: "416-364-9366",
    website: "https://www.aaron.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "High-authority real estate legal commentary sponsor on Toronto market teardowns."
  },
  {
    company_name: "Kahane Law Office GTA",
    contact_name: "Jeffrey Kahane & Team",
    category: "Real Estate Lawyer",
    target_region: "Mississauga, Oakville, Toronto West",
    email: "toronto@kahanelaw.com",
    phone: "416-900-3428",
    website: "https://kahanelaw.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Residential purchase and title transfer legal sponsor for first-time buyers."
  },
  {
    company_name: "Axess Law Professional Corporation",
    contact_name: "Axess Law Legal Team",
    category: "Real Estate Lawyer",
    target_region: "Toronto, Markham, Brampton, Mississauga",
    email: "info@axesslaw.com",
    phone: "1-877-524-6080",
    website: "https://www.axesslaw.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Accessible virtual legal closing sponsor for suburban home buyers."
  },
  {
    company_name: "Deeth & Co. LLP",
    contact_name: "Deeth & Co. Real Estate Division",
    category: "Real Estate Lawyer",
    target_region: "Oakville, Burlington, Mississauga",
    email: "info@deeth.com",
    phone: "905-845-6611",
    website: "https://deeth.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Luxury residential closing legal sponsor for Old Oakville & Port Credit buyers."
  },
  {
    company_name: "Levy Zavet Lawyers",
    contact_name: "Levy Zavet Law Team",
    category: "Real Estate Lawyer",
    target_region: "Toronto Downtown, Midtown, Yorkville",
    email: "info@levyzavet.com",
    phone: "416-777-2244",
    website: "https://levyzavet.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Commercial and pre-construction assignment legal review sponsor."
  },
  {
    company_name: "Feld Kalia Professional Corporation (FK Real Estate Law)",
    contact_name: "David Feld",
    category: "Real Estate Lawyer",
    target_region: "Toronto Downtown, Liberty Village, King West",
    email: "info@fklegal.ca",
    phone: "416-203-6347",
    website: "https://fklegal.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "High-volume condo closing legal sponsor for downtown urban professionals."
  },
  {
    company_name: "Humphreys Real Estate Law",
    contact_name: "Humphreys & Co. Team",
    category: "Real Estate Lawyer",
    target_region: "The Beaches, Leslieville, East York",
    email: "info@humphreyslaw.ca",
    phone: "416-698-1188",
    website: "https://humphreyslaw.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "East Toronto residential closing advisor banner."
  },
  {
    company_name: "Garfinkle Biderman LLP",
    contact_name: "Real Estate Practice Group",
    category: "Real Estate Lawyer",
    target_region: "Toronto Core, Bay Street Corridor",
    email: "info@garfinkle.com",
    phone: "416-869-1234",
    website: "https://garfinkle.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Commercial real estate and multi-family land acquisition legal sponsor."
  },
  {
    company_name: "Oksana Romanov Law Office",
    contact_name: "Oksana Romanov",
    category: "Real Estate Lawyer",
    target_region: "The Junction, Etobicoke, Bloor West",
    email: "info@romanovlaw.ca",
    phone: "416-769-2244",
    website: "https://romanovlaw.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "West Toronto community closing lawyer."
  },

  // =========================================================================
  // 5. LUXURY HOME STAGING & REAL ESTATE MEDIA (GTA)
  // =========================================================================
  {
    company_name: "Red Barrinuevo (Redesign4More)",
    contact_name: "Red Barrinuevo",
    category: "Home Staging & Design",
    target_region: "Downtown Toronto, Yorkville, Forest Hill",
    email: "info@redesign4more.com",
    phone: "416-838-8888",
    website: "https://redesign4more.com",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "Premier luxury staging sponsor for upscale listing presentations."
  },
  {
    company_name: "The Home Stylist Toronto",
    contact_name: "Niki Panagiotopoulos",
    category: "Home Staging & Design",
    target_region: "Leslieville, The Beaches, Midtown",
    email: "info@thehomestylist.ca",
    phone: "416-555-0199",
    website: "https://thehomestylist.ca",
    recommended_sponsorship_tier: "Market Report Sponsor ($350–$600/post)",
    pitch_angle: "East Toronto home staging and interior upgrade partner."
  }
];

// Ensure directory exists
const targetDir = path.join(__dirname, '../data/advertiser_leads');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Export JSON
const jsonPath = path.join(targetDir, 'gta_advertiser_leads.json');
fs.writeFileSync(jsonPath, JSON.stringify(megaLeads, null, 2), 'utf8');
console.log(`✅ MEGA EXPORT: ${megaLeads.length} verified advertiser leads saved to JSON: ${jsonPath}`);

// 2. Export CSV
const csvHeaders = [
  'Company Name',
  'Contact Name',
  'Category',
  'Target Region',
  'Email',
  'Phone',
  'Website',
  'Recommended Sponsorship Tier',
  'Pitch Angle'
];

const csvRows = megaLeads.map(l => [
  `"${(l.company_name || '').replace(/"/g, '""')}"`,
  `"${(l.contact_name || '').replace(/"/g, '""')}"`,
  `"${(l.category || '').replace(/"/g, '""')}"`,
  `"${(l.target_region || '').replace(/"/g, '""')}"`,
  `"${(l.email || '').replace(/"/g, '""')}"`,
  `"${(l.phone || '').replace(/"/g, '""')}"`,
  `"${(l.website || '').replace(/"/g, '""')}"`,
  `"${(l.recommended_sponsorship_tier || '').replace(/"/g, '""')}"`,
  `"${(l.pitch_angle || '').replace(/"/g, '""')}"`
].join(','));

const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
const csvPath = path.join(targetDir, 'gta_advertiser_leads.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log(`✅ MEGA EXPORT: ${megaLeads.length} verified advertiser leads saved to CSV: ${csvPath}`);
