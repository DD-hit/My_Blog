---
title: Key Commands
date: 2025-12-26
tags: []
categories: [技术笔记]
---

# Key Commands

1. 启动hadoop集群

   - master上运行：`start-all.sh`,然后所有主机上jps检查

2. 启动ZooKeeper集群

   - 分别在所有主机上运行：`zkServer.sh start`，然后检查`zkServer.sh status`

3. 启动Hbase集群

   - master上运行：`start-hbase.sh` ,然后所有主机上jps检查

4. 登录MySQL：

   ```mysql
   mysql -uroot -pMyNewPass4!
   ```

   

5. Spark on YARN

   - 只需要启动了hadoop集群即可使用，`spark-submit --class ……`

6. 启动Kafka集群

   - 启动之前需要先启动Zookeeper集群
   
   - 在所有主机上运行：
     ```
     cd kafka_2.11-0.10.2.1/
     
     bin/kafka-server-start.sh -daemon config/server.properties
     ```
     
     
   
   