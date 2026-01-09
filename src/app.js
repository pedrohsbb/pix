const express = require('express');
const { ParticipantsRepository } = require('./participantsRepository');

function createApp({ bcbUrl, cacheTtlMs, httpClient } = {}) {
  const app = express();

  const repo = new ParticipantsRepository({
    url: bcbUrl || process.env.BCB_PIX_URL,
    ttlMs: cacheTtlMs || Number(process.env.CACHE_TTL_MS) || 300000,
    http: httpClient,
  });

  app.get('/pix/participants/:ispb', async (req, res) => {
    try {
      const participant = await repo.findByIspb(req.params.ispb);
      if (!participant) return res.status(404).json({ error: 'Participant not found' });
      res.json(participant);
    } catch {
      res.status(502).json({ error: 'BCB unavailable' });
    }
  });

  return app;
}

module.exports = { createApp };