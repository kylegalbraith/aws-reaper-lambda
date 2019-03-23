'use strict';
var AWS = require("aws-sdk");

module.exports.reaper = async (event, context, callback) => {
  var ec2Client = new AWS.EC2();
  var decribeVolumeParams = {
    Filters: [
      {
        Name: "status",
        Values: ["available"]
      }
    ]
  };

  try
  {
    var availableVolumes = await ec2Client.describeVolumes(decribeVolumeParams).promise();
    var deleteVolumePromises = [];
    availableVolumes.Volumes.forEach((volume) => {
      var deleteVolumeParams = {
        VolumeId: volume.VolumeId
      };
      console.log(`Scheduling delete of volume: ${volume.VolumeId}`);
      deleteVolumePromises.push(ec2Client.deleteVolume(deleteVolumeParams).promise());
    });

    await Promise.all(deleteVolumePromises);
    return callback(null, `Successfully removed ${availableVolumes.Volumes.length} EBS volumes.`);
  } catch(err) {
    return callback(err);
  }
};
