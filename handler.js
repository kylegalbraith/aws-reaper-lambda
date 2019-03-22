'use strict';

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
      deleteVolumePromises.push(ec2Client.DeleteVolume(deleteVolumeParams).promise());
    });

    var results = await Promise.all(deleteVolumePromises);
  } catch(err) {
    return callback(err);
  }
};
