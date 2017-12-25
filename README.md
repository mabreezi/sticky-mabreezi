# Kibaati Ledger with a persistent REST server

This is the implementation of a business network with a persistent REST server.

## Usage
  
### Clone the repository
  
```
git clone https://github.com/kibaati/persistent-kibaati-ledger.git
```

### Deploy the business network
  
Assuming you already have a Hypeledger Fabric network running, run the commands below in the terminal. If you have not set up Fabric network, follow the [instructions here](https://hyperledger.github.io/composer/installing/development-tools.html). An explanation of the commands can be found [here](https://hyperledger.github.io/composer/tutorials/developer-tutorial.html).
  
```
$ composer runtime install --card PeerAdmin@hlfv1 --businessNetworkName kibaati-ledger
```
```
$ composer network start --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --archiveFile kibaati-ledger@0.0.1.bna --file networkadmin.card
```
```
$ composer card import --file networkadmin.card
```
```
$ composer network ping --card admin@kibaati-ledger
```
  
### Deploy a Persistent REST server
  
Before deploying the persistent REST server, follow the instructions below:
1. Run the command below. This makes sure all users have full access rights to the `.composer` folder which is necessary so that the docker commands we run later have write access to it. You can have a look at this [issue](https://github.com/hyperledger/composer/issues/2985) for an explanation
  
```
$ chmod -R 777 ~/.composer
```
  
2. Go to the folder in the `.composer` folder that contains the busines network cards, go to the kibaati-ledger business card folder and open the `connection.json` file with nano. Change all instances of `localhost` to the IP address of your machine. In this case the IP address has already been changed to the address `10.0.16.4`, the IP address of my machine, change all instances of that IP to your machine's IP address. Use the command below to get to the location of the connection.json file. The reason for this can be found [here](https://github.com/hyperledger/composer/issues/3002), [here](https://github.com/hyperledger/composer/issues/2898) and [here](https://github.com/hyperledger/composer/issues/2908).
  
```
$ cd ~/.composer/cards/admin@kibaati-ledger
```
  
3. After completing the steps above, complete the steps in this [tutorial](https://hyperledger.github.io/composer/integrating/deploying-the-rest-server.html) to install a mongodb instance that will hold the persistent data as well as set up a docker container that will deploy your rest server. At the end if all goes well run `docker logs -f rest` and the result should be similar to the one below:
  
```
0|composer | WARNING: NODE_APP_INSTANCE value of '0' did not match any instance config file names.
0|composer | WARNING: See https://github.com/lorenwest/node-config/wiki/Strict-Mode
0|composer | Discovering types from business network definition ...
0|composer | Discovered types from business network definition
0|composer | Generating schemas for all types in business network definition ...
0|composer | Generated schemas for all types in business network definition
0|composer | Adding schemas for all types to Loopback ...
0|composer | Added schemas for all types to Loopback
0|composer | Web server listening at: http://localhost:3000
0|composer | Browse your REST API at http://localhost:3000/explorer
```
This shows that our REST server connected to our business netowrk is running on localhost on port 3000.
