class ApiResponse {
  constructor(data, message = "Success", statusCode = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300; // Indicates if the response is successful
  }
}
export default ApiResponse;
