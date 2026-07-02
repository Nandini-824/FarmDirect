import React, { useState } from 'react';

export default function GovernmentSchemes() {
  // const [inputs, setInputs] = useState({ state: '', landSize: '', cropType: '' });
  // const [queried, setQueried] = useState(false);

  const policyMockDb = [
   
    {
      title: "Pradhan Mantri Fasal Bima Yojana",
      scope:
        "PMKSY aims to improve irrigation facilities, enhance water-use efficiency, and ensure 'Har Khet Ko Pani' by providing financial assistance for irrigation infrastructure and water conservation projects.",
      criteria:
        "Applicable to eligible farmers as per Government of India and State Government guidelines.",
      source: "Department of Agriculture & Farmers Welfare",
      date: "05-08-2017",
      website: "https://pmfby.gov.in/ext/rpt/ssfr_17",

  pdf: "https://agriwelfare.gov.in/Documents/PMFBY_Guidelines.pdf"
      
    },
    {
      title: "Agriculture Infrastructure Fund (AIF)",
    
      summary:
        "The Agriculture Infrastructure Fund provides medium- to long-term financing for post-harvest management infrastructure and community farming assets, helping improve agricultural infrastructure and farmer income.",
    
      source: "Department of Agriculture & Farmers Welfare",
    
      date: "12-06-2024",
    
      website: "http://agriinfra.dac.gov.in/",
    
      pdf: "https://agriwelfare.gov.in/Documents/AIF_Guidelines_English_12Jun24.pdf",
    
      eligibility:
        "Farmers, FPOs, PACS, Agri-Entrepreneurs, Startups, SHGs, Cooperative Societies and other eligible entities.",
    
      status: "Active"
    },
    
      {
        title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
      
        summary:
          "Improve irrigation facilities and increase water-use efficiency through the 'Har Khet Ko Pani' initiative.",
      
        source: "Ministry of Agriculture & Farmers Welfare",
      
        date: "06-05-2016",
      
        website: "https://pmksy.mowr.gov.in/",
      
        pdf: "https://agriwelfare.gov.in/Documents/Guidelines_PMKSY.pdf"
      },
      {
        title: "Soil Health Card Scheme",
      
        summary:
          "The Soil Health Card Scheme helps farmers assess the nutrient status of their soil and provides crop-wise fertilizer recommendations to improve soil fertility and increase agricultural productivity.",
      
        source: "Department of Agriculture & Farmers Welfare",
      
        date: "01-09-2016",
      
        website: "https://soilhealth.dac.gov.in/",
      
        pdf: "https://agriwelfare.gov.in/Documents/Guidelines_Soil%20Health%20Card.pdf",
      
        eligibility:
          "All farmers are eligible to receive Soil Health Cards through the Soil Health Card Scheme.",
      
        status: "Active"
      },
      {
        title: "Plant Quarantine Clearance System",
      
        summary:
          "The Plant Quarantine Clearance System facilitates online applications for import and export of plants, seeds, and other regulated agricultural products to prevent the spread of pests and diseases.",
      
        source: "Department of Agriculture & Farmers Welfare",
      
        date: "05-01-2011",
      
        website: "https://pqms.cgg.gov.in/pqms-angular/home",
      
        pdf: "https://agriwelfare.gov.in/Documents/Quarantine_Guidelinespdf.pdf",
      
        eligibility:
          "Importers, exporters, farmers, nurseries, seed companies, and other stakeholders dealing with regulated plant materials.",
      
        status: "Active"
      },
      {
        title: "Online Pesticide Registration",
      
        summary:
          "The Online Pesticide Registration system enables manufacturers and importers to apply for pesticide registration online under the Insecticides Act, ensuring safe and regulated pesticide use in agriculture.",
      
        source: "Department of Agriculture & Farmers Welfare",
      
        date: "23-09-2009",
      
        website: "https://ppqs.gov.in/",
      
        pdf: "https://agriwelfare.gov.in/Documents/Pesticides_Registration.pdf",
      
        eligibility:
          "Pesticide manufacturers, importers, formulators, and organizations applying for pesticide registration under the Insecticides Act.",
      
        status: "Active"
      },
      {
        title: "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
      
        summary:
          "PM-KUSUM is a central government scheme designed to provide energy security to farmers by subsidizing the installation of solar pumps, solarizing existing grid-connected agricultural pumps, and setting up small renewable power plants on barren or cultivable land.",
      
        source: "Ministry of New and Renewable Energy (MNRE)",
      
        date: "08-03-2019",
      
        website: "https://pmkusum.mnre.gov.in/",
      
        eligibility:
          "Individual farmers, groups of farmers, cooperatives, panchayats, and Water User Associations (WUAs).",
      
        status: "Active"
      },

      
   {
    title: "PM-KISAN Samman Nidhi",
  
    summary:
      "PM-KISAN is a Central Government scheme that provides eligible farmer families with financial assistance of ₹6,000 per year in three equal installments of ₹2,000 through Direct Benefit Transfer (DBT).",
  
    source: "Department of Agriculture & Farmers Welfare",
  
    date: "24-02-2019",
  
    website: "https://pmkisan.gov.in/",
  
    eligibility:
      "Eligible landholding farmer families as per PM-KISAN guidelines.",
  
    status: "Active"
  },
      { title: 'PM-KISAN Structural Direct Yield Allocation', scope: 'Direct cash asset transfer safety operations matching all standard holdings.', criteria: 'Universal smallholder registry access tracking.' }
  ];

  return (
    // <div className="max-w-5xl mx-auto px-4 py-12">
    //   <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
    //     <h2 className="text-2xl font-bold text-slate-800">State Framework Policy Finder</h2>
    //     <p className="text-slate-500 text-sm mt-1">Audit statutory central and local agricultural subsidies corresponding to your farm blueprint.</p>
        
    //     <form onSubmit={e => { e.preventDefault(); setQueried(true); }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
    //       <input required type="text" placeholder="State Zone Region" value={inputs.state} onChange={e => setInputs({...inputs, state: e.target.value})} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
    //       <input required type="number" placeholder="Land Scale Area (Acres)" value={inputs.landSize} onChange={e => setInputs({...inputs, landSize: e.target.value})} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
    //       <input required type="text" placeholder="Crop Classification" value={inputs.cropType} onChange={e => setInputs({...inputs, cropType: e.target.value})} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
    //       <button type="submit" className="sm:col-span-3 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm tracking-wide shadow-sm mt-2">
    //         Execute Programmatic Matching Logic
    //       </button>
    //     </form> 
    //   </div>

    <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mt-8 space-y-4 animate-fadeIn">
        <h2 className="text-3xl font-bold text-slate-800">
      Government Schemes
    </h2>

    <p className="text-slate-500" >
      Browse the latest government schemes available for farmers.
      Click "Visit Website" to learn more or "View Guidelines" for detailed documents.
    </p>

    <div className="grid grid-cols-1 gap-6">
          {policyMockDb.map((p, i) => (
            <div
              key={i}
             className="bg-white rounded-2xl border-l-4 border-l-green-600 border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow w-full"
            >
              <h4 className="font-bold text-slate-800 text-base">
                {p.title}
              </h4>
          
              <p className="text-sm text-slate-600 mt-2">
                {p.summary}
              </p>
          
              <p className="text-xs text-slate-500 mt-2">
                📅 {p.date}
              </p>
          
              <p className="text-xs text-slate-500">
                🏢 {p.source}
              </p>
          
              {/* 👇 Put the buttons here */}
              <div className="mt-4 flex gap-3">
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Visit Website
                </a>
          
                {p.pdf && (
                  <a
                    href={p.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-green-600 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50"
                  >
                    View Guidelines
                  </a>
                )}
              </div>
            
            </div>
          ))}
          </div>

        </div>

      
    </div>
    

  );
}
