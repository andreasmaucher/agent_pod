import { TwitterApi } from "twitter-api-v2";

export async function postTweet(tweetText: string) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY as string,
    appSecret: process.env.TWITTER_CONSUMER_SECRET as string,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY as string,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
  });

  try {
    const response = await client.v2.tweet(tweetText);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error posting tweet:", error);
    return { success: false, error: "Failed to post tweet" };
  }
}
