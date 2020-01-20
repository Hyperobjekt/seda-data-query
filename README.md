# Summary

This repository contains code for the API endpoints used to query the seda database and return results.  Deploying is handled with the serverless framework.  

To run locally, run:

```
npm i -g serverless
npm install
serverless offline
```

Deploy to AWS with `serverless deploy`.  You must have AWS credentials on your system.

# Database

The database is manually configured (AWS RDS, postgres).  The table structure can be found in `db.sql`.

Currently, data is manually imported using pgadmin and shaping the CSV data with the following commands:

## Counties

```
csvcut -c id,lon,lat,name,all_ses,w_ses,b_ses,h_ses,wb_ses,wh_ses,wb_seg,wh_seg,np_seg,wb_min,wh_min,state,all_sz,all_avg,all_grd,all_coh,a_sz,a_avg,a_grd,a_coh,b_sz,b_avg,b_grd,b_coh,p_sz,p_avg,p_grd,p_coh,f_sz,f_avg,f_grd,f_coh,h_sz,h_avg,h_grd,h_coh,m_sz,m_avg,m_grd,m_coh,mf_sz,mf_avg,mf_grd,mf_coh,np_sz,np_avg,np_grd,np_coh,wa_sz,pn_sz,pn_avg,pn_grd,pn_coh,wa_avg,wa_grd,wa_coh,wb_sz,wb_avg,wb_grd,wb_coh,wh_sz,wh_avg,wh_grd,wh_coh,w_sz,w_avg,w_grd,w_coh,state_name counties.csv | sed "s/-999.0//g" | csvgrep -i -c state -m '-999' > counties-import.csv
```

## Districts

```
csvcut -c id,lon,lat,name,all_ses,w_ses,b_ses,h_ses,wb_ses,wh_ses,wb_seg,wh_seg,np_seg,wb_min,wh_min,state,all_sz,all_avg,all_grd,all_coh,a_sz,a_avg,a_grd,a_coh,b_sz,b_avg,b_grd,b_coh,p_sz,p_avg,p_grd,p_coh,f_sz,f_avg,f_grd,f_coh,h_sz,h_avg,h_grd,h_coh,m_sz,m_avg,m_grd,m_coh,mf_sz,mf_avg,mf_grd,mf_coh,np_sz,np_avg,np_grd,np_coh,wa_sz,pn_sz,pn_avg,pn_grd,pn_coh,wa_avg,wa_grd,wa_coh,wb_sz,wb_avg,wb_grd,wb_coh,wh_sz,wh_avg,wh_grd,wh_coh,w_sz,w_avg,w_grd,w_coh,state_name districts.csv | sed "s/-999.0//g" | csvgrep -i -c state -m '-999' > districts-import.csv
```

## Schools

```
csvcut -c id,name,city,state_name,state,all_frl,all_avg,all_coh,all_grd,all_sz,lat,lon,w_pct,b_pct,a_pct,i_pct,h_pct schools.csv > schools-import.csv
```

# Endpoints

- getSchool: `/schools/{id}`
- getSchools: `/schools`
- getDistrict: `/districts/{id}`
- getDistricts: `/districts`
- getCounty: `/counties/{id}`
- getCounties: `/counties`