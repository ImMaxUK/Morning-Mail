/**
 * Copyright (c) 2021-Present, ImMaxUK (github.com/ImMaxUK).
 * 
 * The source code is licensed under the Apache License found in the
 * LICENSE file in the root directory of this source tree.
 */

const { log } = require('./utils/logger')
require('dotenv').config({ path: '.env' })

log.info('Server Online')
log.info('Awaiting Cron Job')

require('./handlers/nodemailer')