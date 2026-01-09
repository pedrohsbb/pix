const axios = require('axios');
const { normalizeIspb } = require('./ispb');

class ParticipantsRepository {
  constructor({ url, ttlMs, http = axios, now = () => Date.now() }) {
    if (!url) throw new Error('BCB_PIX_URL is required');
    this.url = url;
    this.ttlMs = ttlMs;
    this.http = http;
    this.now = now;
    this.cache = null;
    this.expires = 0;
  }

  async getAll() {
    const t = this.now();
    if (this.cache && t < this.expires) return this.cache;
    const res = await this.http.get(this.url);
    this.cache = res.data;
    this.expires = t + this.ttlMs;
    return this.cache;
  }

  async findByIspb(ispb) {
    const target = normalizeIspb(ispb);
    if (!target) return null;
    const all = await this.getAll();
    return all.find(p => normalizeIspb(p.ispb ?? p.ISPB) === target) || null;
  }
}

module.exports = { ParticipantsRepository };