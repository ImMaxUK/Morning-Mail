/**
 * Copyright (c) 2021-Present, ImMaxUK (github.com/ImMaxUK).
 * 
 * The source code is licensed under the Apache License found in the
 * LICENSE file in the root directory of this source tree.
 */

const { log } = require('./utils/logger')
const cron = require('node-cron')
require('dotenv').config({ path: '.env' })

log.info('Server Online')
log.info('Awaiting Cron Job')

cron.schedule(process.env.CRON, () => {
    log.info('Sending Morning Mail...')
    require('./handlers/nodemailer')
})