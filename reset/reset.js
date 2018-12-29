const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-2'});
var ec2 = new AWS.EC2();
const fs = require('fs')



let fileData = JSON.parse(fs.readFileSync('./state.json'));
const snapshotId = fileData.SnapshotId
const instanceId = fileData.InstanceId

const describeVolumesParams = {
  Filters: [
    {
      Name: "attachment.instance-id",
      Values: [
        instanceId
      ]
    }
  ]
};

const outputFunc = function (err, data) {
  if (err) {
    console.log(err)
  }
  console.log(data)
}


const stopInstanceAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.stopInstances(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}

const startInstanceAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.startInstances(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}

const describeVolumesAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.describeVolumes(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}

const detachVolumeAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.detachVolume(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}

const deleteVolumeAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.deleteVolume(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}

const createVolumeAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.createVolume(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}

const attachVolumeAsPromise = (params) => {
  return new Promise((resolve, reject) => {
    ec2.attachVolume(params, (err, data) =>
        err ? reject(err) : resolve(data)
    )
  })
}




const timeoutPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("WAITING");
    resolve(null)
  }, 10000);
});


async function go() {
  let stopinstance = await stopInstanceAsPromise({InstanceIds: [instanceId]});
  await new Promise((res) => setTimeout(() => res(null), 55000));
  let describeVolume = await describeVolumesAsPromise(describeVolumesParams)
  let volumeid = await describeVolume.Volumes[0].Attachments[0].VolumeId
  let _ = await detachVolumeAsPromise({VolumeId: volumeid})
  await new Promise((res) => setTimeout(() => res(null), 5000));
  let __ = await deleteVolumeAsPromise({VolumeId: volumeid})
  await new Promise((res) => setTimeout(() => res(null), 5000));
  let ___ = await createVolumeAsPromise({
    AvailabilityZone: "us-east-2c",
    Size: 10,
    VolumeType: "gp2",
    SnapshotId: snapshotId
  })
  await new Promise((res) => setTimeout(() => res(null), 5000));
  let ____ = await attachVolumeAsPromise(
      {
        Device: "/dev/xvda",
        InstanceId: instanceId,
        VolumeId: ___.VolumeId
      })

  await new Promise((res) => setTimeout(() => res(null), 5000));
  let startinstance = await startInstanceAsPromise({InstanceIds: [instanceId]});


}

go()
