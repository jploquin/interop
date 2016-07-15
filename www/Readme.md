First create a proxyapp in the apache2.conf
ProxyPass /node http://localhost:8080/
Apache will redirect /node requests to nodejs 

then c reate 2 links in the root html path of apache2:
ln -s /home/cloud/interop/www/appv2 appv2
ln -s /home/cloud/interop/www/img img
