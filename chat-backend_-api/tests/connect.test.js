const request = require('supertest');
const app = require('../index'); // Ensure your server is set up to be exported

describe('POST /api/connect', () => {
  it('should create a new chat session and return a chat ID for valid input', async () => {
    const response = await request(app).post('/api/connect').send({
      firstName: 'John',
      lastName: 'Doe',
      panNumber: 'ABCPD1234E',
      preferredLanguage: 'English',
      secondaryLanguage: 'Hindi'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('chatId');
  });

  it('should return an error for missing required fields', async () => {
    const response = await request(app).post('/api/connect').send({
      firstName: 'John',
      lastName: 'Doe',
      // Missing PAN Number
      preferredLanguage: 'English',
      secondaryLanguage: 'Hindi'
    });
    expect(response.statusCode).toBe(400);
  });

  it('should return an error when client is already in a session', async () => {
    // First request to create a session
    await request(app).post('/api/connect').send({
      firstName: 'Jane',
      lastName: 'Doe',
      panNumber: 'ABCPJ1234E',
      preferredLanguage: 'Hindi',
      secondaryLanguage: 'English'
    });

    // Second request with the same PAN number
    const response = await request(app).post('/api/connect').send({
      firstName: 'Jane',
      lastName: 'Doe',
      panNumber: 'ABCPJ1234E',
      preferredLanguage: 'Hindi',
      secondaryLanguage: 'English'
    });
    expect(response.statusCode).toBe(409);
  });

  it('should return an error when no matching CAs are found', async () => {
    const response = await request(app).post('/api/connect').send({
      firstName: 'John',
      lastName: 'Doe',
      panNumber: 'ABCPD7890F',
      preferredLanguage: 'Spanish',
      secondaryLanguage: 'Italian'
    });
    expect(response.statusCode).toBe(404);
  });
});