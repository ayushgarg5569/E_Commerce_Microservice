// authController.js

const Models = require("../models");
const jwt = require('./jwt')
class AuthController {
    constructor() {
        this.queryService = new Models();
    }

    async register(req, res) {
        const { username, password, email } = req.body;

        try {
            const existingUser = await this.queryService.findUsername(username);

            if (existingUser) {
                throw new Error("Username already exist");
            }

            const result = await this.queryService.saveUser(username, password, email);
            return res.send({ message: "User Registerd Successfully." });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    async login(req, res) {
        try {

            const { username, password } = req.body;

            const result = await this.queryService.checkUser(username, password);

            if (!result)
                return res.json({ message: "Invalid login credentials" });

            const token = await jwt.issueNewTokens(req, res)
            return res.json({ token: token });

        } catch (error) {
            res.send({ message: error.message });
        }

    }

    async getProfile(req, res) {
        const userId = req.user.id;
        try {
            const user = await this.queryService.getUserById(userId);
            res.json(user);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = AuthController;