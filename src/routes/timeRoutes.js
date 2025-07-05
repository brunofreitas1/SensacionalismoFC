"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timeController_1 = require("../controllers/timeController");
const router = (0, express_1.Router)();
// GET /times - lista todos os times
router.get('/', timeController_1.listarTimes);
exports.default = router;
