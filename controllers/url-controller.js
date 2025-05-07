const { initRepository, getRepository } = require('../models/shortUrl');
const shortid = require('shortid');

exports.index = async (req, res) => {
    const repo = getRepository();
    const entities = await repo.search().return.all();
    const shortUrls = entities.map(e => e.toJSON());
    res.render('index',{shortUrls});
};
exports.shortenUrl = async (req, res) => {
    const repo = getRepository();
    const {fullUrl} = req.body;
    const shortUrl = repo.createEntity({
        full: fullUrl,
        short: shortid.generate(),
        clicks: 0
    });
    await repo.save(shortUrl);
    res.redirect('/');
};
exports.redirectUrl = async (req, res) => {
    const repo = getRepository();
    const results = await repo.search()
        .where('short').equals(req.params.short)
        .return.all();
    const url = results[0];
    url.clicks++;
    await repo.save(url);
    res.redirect(url.full);
};
exports.deleteUrl = async (req,res) => {
    const repo = getRepository();
    const results = await repo.search()
        .where('short').equals(req.params.short)
        .return.all();
    const url = results[0];
    await repo.remove(url.entityId);

    res.redirect('/');
    
};
