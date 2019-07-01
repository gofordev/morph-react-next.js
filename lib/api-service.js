import request from "superagent"

export const fetchRates = () => {
  return request.get(`${process.env.API_HOST}/rates`).then(resp => resp.body)
}

export const fetchTrade = id => {
  return request
    .get(`${process.env.API_HOST}/morph/${id}`)
    .then(resp => resp.body)
}

export const postTrade = body => {
  return request
    .post(`${process.env.API_HOST}/morph`)
    .send(body)
    .then(resp => resp.body)
}
