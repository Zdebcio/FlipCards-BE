import MessageResponse from './MessageResponse.interface';

export default interface ErrorResponse extends MessageResponse {
  stack?: string;
}
