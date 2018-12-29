const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'});
var ec2 = new AWS.EC2();
const fs = require('fs')
const updateState = require('./updateState.js')


let fileData = JSON.parse(fs.readFileSync('./state.json'));
const volumeId = fileData.VolumeId

var params = {
  Description: "This is my latest volume snapshot.",
  VolumeId: volumeId
};



ec2.createSnapshot(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred

  console.log(data.SnapshotId)
  updateState({ "SnapshotId" : data.SnapshotId})



});


