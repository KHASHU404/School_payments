"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = void 0;
var class_validator_1 = require("class-validator");
var StudentInfoDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StudentInfoDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.id = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _id_initializers, void 0));
                this.email = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                __runInitializers(this, _email_extraInitializers);
            }
            return StudentInfoDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _id_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _email_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var CreateOrderDto = function () {
    var _a;
    var _school_id_decorators;
    var _school_id_initializers = [];
    var _school_id_extraInitializers = [];
    var _trustee_id_decorators;
    var _trustee_id_initializers = [];
    var _trustee_id_extraInitializers = [];
    var _gateway_name_decorators;
    var _gateway_name_initializers = [];
    var _gateway_name_extraInitializers = [];
    var _custom_order_id_decorators;
    var _custom_order_id_initializers = [];
    var _custom_order_id_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateOrderDto() {
                this.school_id = __runInitializers(this, _school_id_initializers, void 0);
                this.trustee_id = (__runInitializers(this, _school_id_extraInitializers), __runInitializers(this, _trustee_id_initializers, void 0));
                this.student_info = __runInitializers(this, _trustee_id_extraInitializers);
                this.gateway_name = __runInitializers(this, _gateway_name_initializers, void 0);
                this.custom_order_id = (__runInitializers(this, _gateway_name_extraInitializers), __runInitializers(this, _custom_order_id_initializers, void 0));
                __runInitializers(this, _custom_order_id_extraInitializers);
            }
            return CreateOrderDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _school_id_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _trustee_id_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _gateway_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _custom_order_id_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _school_id_decorators, { kind: "field", name: "school_id", static: false, private: false, access: { has: function (obj) { return "school_id" in obj; }, get: function (obj) { return obj.school_id; }, set: function (obj, value) { obj.school_id = value; } }, metadata: _metadata }, _school_id_initializers, _school_id_extraInitializers);
            __esDecorate(null, null, _trustee_id_decorators, { kind: "field", name: "trustee_id", static: false, private: false, access: { has: function (obj) { return "trustee_id" in obj; }, get: function (obj) { return obj.trustee_id; }, set: function (obj, value) { obj.trustee_id = value; } }, metadata: _metadata }, _trustee_id_initializers, _trustee_id_extraInitializers);
            __esDecorate(null, null, _gateway_name_decorators, { kind: "field", name: "gateway_name", static: false, private: false, access: { has: function (obj) { return "gateway_name" in obj; }, get: function (obj) { return obj.gateway_name; }, set: function (obj, value) { obj.gateway_name = value; } }, metadata: _metadata }, _gateway_name_initializers, _gateway_name_extraInitializers);
            __esDecorate(null, null, _custom_order_id_decorators, { kind: "field", name: "custom_order_id", static: false, private: false, access: { has: function (obj) { return "custom_order_id" in obj; }, get: function (obj) { return obj.custom_order_id; }, set: function (obj, value) { obj.custom_order_id = value; } }, metadata: _metadata }, _custom_order_id_initializers, _custom_order_id_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateOrderDto = CreateOrderDto;
