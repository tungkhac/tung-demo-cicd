// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { searchCard } = require("../GMO");
const { generateLog } = require("../helper");
const { RAKURAKU_PREFIX } = require("../constants");

const getCardList = async (req, res) => {
  const { customer_id, siteID, sitePass } = req.body;
  try {
    const cards = await searchCard({
      memberID: RAKURAKU_PREFIX + customer_id,
      siteID,
      sitePass,
    });
    return res.status(200).json({
      data: cards
        .map((card, i) => {
          return {
            text: card,
            value: i,
          };
        })
        .concat([
          {
            text: "New card",
            value: -1,
          },
        ]),
    });
  } catch (err) {
    console.log(
      generateLog("/getCardList error", { err, message: err.message })
    );
    /* istanbul ignore next */
    return res
      .status(400)
      .json({ error_message: (err && err.message) || "getCardList error" });
  }
};

module.exports = {
  getCardList,
};
