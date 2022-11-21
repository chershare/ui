export interface Booking { // conform to db
  local_id: string, 
  resource_name: string, 
  booker_account_id: string, 
  start: number, 
  end: number,
  price: number, 
}
