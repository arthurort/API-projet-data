const joi = require("joi");
const db = require("../../utils/database");
const tittle = require("tittle");

module.exports = {
    method: "GET",
    path: "/profil/{id}/mvts",
    config: {
        validate: {
            params: joi.object().keys({
                id: [
                    joi.string().required(),
                    joi
                        .number()
                        .integer()
                        .positive()
                        .required()
                ]
            })
        }
    },

    // SELECT date(`mvts`.`date`) AS `date`, `mvts`.`montant` AS`montant`
    // FROM`mvts`
    // LEFT JOIN`profils` `profils__via__profil_id` ON`mvts`.`profil_id` = `profils__via__profil_id`.`id`
    // WHERE`profils__via__profil_id`.`id` = 8
    // GROUP BY date(`mvts`.`date`), `mvts`.`montant`
    // ORDER BY date(`mvts`.`date`) ASC, `mvts`.`montant` ASC
    // LIMIT 2000


    handler: async function (req, handler) {
        const pageNumber = parseInt(req.query.page) - 1;
        
        const query = db.select(
                'mvts.date as date',
                'mvts.montant as montant'
            )
            .from("mvts")
            .leftJoin('profils',' mvts.profil_id ', '=',' profils.id')
            .where({"profils.id": req.params.id})
            .limit(1000)
            .offset(pageNumber * 1000); 
        let [profil, error] = await tittle(query);
        if (error) {
            return handler
                .response({
                    statusCode: 400,
                    error
                })
                .code(400);
        }

        return handler
            .response({
                statusCode: 200,
                data: profil,
                links: {
                    previous: pageNumber
                        ? `http://localhost:8000/profil/` + req.params.id+`/mvts?page=${pageNumber}`
                        : null,
                    next: `http://localhost:8000/profil/` + req.params.id +`/mvts?page=${pageNumber + 2}`
                }
            })
            .code(200);
    }
};
