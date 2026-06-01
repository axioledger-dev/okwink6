cd ~/boyue
./start_webman.sh status
./start_webman.sh restart
sudo -u caipiao bash -c "cd /home/caipiao/boyue && ./start_webman.sh start"
./start_webman.sh stop      # Dừng
./start_webman.sh restart 
./start_webman.sh status
./start_webman.sh restart
/home/caipiao/
ll
pkill -f "php.*start.php" && pkill -f "WorkerMan" && sleep 2 && ps aux | grep -E "(php.*start.php|WorkerMan)" | grep -v grep
cd /home/caipiao/boyue
./start_webman.sh start
sudo nginx -t && sudo systemctl reload nginx
sudo cp /home/caipiao/nginx-okwink6.conf /etc/nginx/sites-available/boyue.okwink6.com
sudo nginx -t && sudo systemctl reload nginx
ll
cd /home/caipiao/boyue
./start_webman.sh start
cd /home/caipiao/boyue
./start_webman.sh start
cd /home/caipiao/boyue
./start_webman.sh status
./start_webman.sh restart
./start_webman.sh stop
tail -f runtime/logs/workerman.log
cd /home/caipiao/boyue && ./start_webman.sh start 2>&1 | tail -30
mv /var/app/bonwinfull/database.sql plugin/admin/
sudo mv /var/app/bonwinfull/database.sql /home/caipiao/boyue/plugin/admin/install.sh
