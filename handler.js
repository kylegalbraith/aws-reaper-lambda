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

  var availableVolumes = await ec2Client.describeVolumes(decribeVolumeParams).promise();
  availableVolumes.Volumes.forEach((volume) => {
    var deleteVolumeParams = {
      VolumeId: volume.VolumeId
    };
    ec2Client.DeleteVolume(deleteVolumeParams)
  });
  }).catch((error) => {
    return callback(error);
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
