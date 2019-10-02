import * as AWS from 'aws-sdk'

export const reaper = async (_event: () => void, _context: any, callback: (arg0: Error | null, arg1?: string) => void) => {
  const ec2Client = new AWS.EC2()
  const decribeVolumeParams: AWS.EC2.Types.DescribeVolumesRequest = {
    Filters: [
      {
        Name: 'status',
        Values: ['available']
      }
    ]
  }

  try {
    const availableVolumes: AWS.EC2.Types.DescribeVolumesResult = await ec2Client.describeVolumes(decribeVolumeParams).promise()
    const Volumes: AWS.EC2.Types.Volume[] = (availableVolumes && availableVolumes.Volumes) || []
    const deleteVolumePromises: Promise<any>[] = []
    Volumes.forEach((volume: AWS.EC2.Types.Volume) => {
      if (!volume.VolumeId) {
        return
      }
      const deleteVolumeParams: AWS.EC2.Types.DeleteVolumeRequest = {
        VolumeId: volume.VolumeId
      }
      console.log(`Scheduling delete of volume: ${volume.VolumeId}`)
      deleteVolumePromises.push(
        ec2Client.deleteVolume(deleteVolumeParams).promise()
      )
    })

    await Promise.all(deleteVolumePromises)
    return callback(null, `Successfully removed ${Volumes.length} EBS volumes.`)
  } catch (err) {
    return callback(err)
  }
}

export default reaper