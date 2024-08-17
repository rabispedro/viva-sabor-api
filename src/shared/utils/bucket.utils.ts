import { Client } from 'minio';

export class BucketUtils {
  static async setupBucket(bucket: Client, bucketName: string): Promise<void> {
    const userBucketExists = await bucket.bucketExists(bucketName);
    if (!userBucketExists) {
      await bucket.makeBucket(bucketName);

      const publicReadPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetBucketLocation', 's3:GetObject'],
            Resource: ['arn:aws:s3:::*'],
          },
        ],
      };

      await bucket.setBucketPolicy(
        bucketName,
        JSON.stringify(publicReadPolicy),
      );
    }
  }
}
