let moment = require('moment');

moment.updateLocale('fr', {
    relativeTime : {
        future: "dans %s",
        past:   "il y a %s",
        s  : 'quelques secondes',
        ss : '%d secondes',
        m:  "une minute",
        mm: "%d minutes",
        h:  "une heure",
        hh: "%d heures",
        d:  "un jour",
        dd: "%d jours",
        M:  "un mois",
        MM: "%d mois",
        y:  "une année",
        yy: "%d années"
    }
});


module.exports = moment;