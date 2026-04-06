export const handler = async (event: any) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  // In a real implementation, this would update aggregates in DynamoDB
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Event processed successfully' }),
  };
};
