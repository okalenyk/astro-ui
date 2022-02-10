import { AwsUploader } from 'services/AwsUploader';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ManagedUpload } from 'aws-sdk/clients/s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
): Promise<ManagedUpload.SendData | void> {
  if (req?.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { Key } = await AwsUploader.uploadToBucket(req);

    return res.status(200).json(Key);
  } catch (err) {
    return res
      .status(500)
      .send('An error occurred while uploading image to S3!');
  }
}
