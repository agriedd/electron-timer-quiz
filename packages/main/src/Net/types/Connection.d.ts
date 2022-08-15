export type host = `${number}.${number}.${number}.${number}` | 'localhost';

export interface ServerData {
  port: number;
  host: host | string;
  maxParticipants: number;
  maxClients: number;
  title: string;
  ssid: string;
  /**
   * unix time
   *
   */
  created_at?: number;
}
