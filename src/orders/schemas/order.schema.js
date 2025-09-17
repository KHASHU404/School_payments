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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.StudentInfoSchema = exports.Order = exports.StudentInfo = void 0;
// src/orders/schemas/order.schema.ts
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var StudentInfo = function () {
    var _classDecorators = [(0, mongoose_1.Schema)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var StudentInfo = _classThis = /** @class */ (function () {
        function StudentInfo_1() {
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.id = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _id_initializers, void 0));
            this.email = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            __runInitializers(this, _email_extraInitializers);
        }
        return StudentInfo_1;
    }());
    __setFunctionName(_classThis, "StudentInfo");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _id_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _email_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudentInfo = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudentInfo = _classThis;
}();
exports.StudentInfo = StudentInfo;
var Order = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _school_id_decorators;
    var _school_id_initializers = [];
    var _school_id_extraInitializers = [];
    var _trustee_id_decorators;
    var _trustee_id_initializers = [];
    var _trustee_id_extraInitializers = [];
    var _student_info_decorators;
    var _student_info_initializers = [];
    var _student_info_extraInitializers = [];
    var _gateway_name_decorators;
    var _gateway_name_initializers = [];
    var _gateway_name_extraInitializers = [];
    var _custom_order_id_decorators;
    var _custom_order_id_initializers = [];
    var _custom_order_id_extraInitializers = [];
    var Order = _classThis = /** @class */ (function () {
        function Order_1() {
            // @Prop({ type: Types.ObjectId })
            // _id?: Types.ObjectId;
            // keep index here
            this.school_id = __runInitializers(this, _school_id_initializers, void 0);
            this.trustee_id = (__runInitializers(this, _school_id_extraInitializers), __runInitializers(this, _trustee_id_initializers, void 0));
            this.student_info = (__runInitializers(this, _trustee_id_extraInitializers), __runInitializers(this, _student_info_initializers, void 0));
            this.gateway_name = (__runInitializers(this, _student_info_extraInitializers), __runInitializers(this, _gateway_name_initializers, void 0));
            // keep index true and sparse for optional unique
            this.custom_order_id = (__runInitializers(this, _gateway_name_extraInitializers), __runInitializers(this, _custom_order_id_initializers, void 0));
            __runInitializers(this, _custom_order_id_extraInitializers);
        }
        return Order_1;
    }());
    __setFunctionName(_classThis, "Order");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _school_id_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true })];
        _trustee_id_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, index: true, sparse: true })];
        _student_info_decorators = [(0, mongoose_1.Prop)({ type: StudentInfo, required: true })];
        _gateway_name_decorators = [(0, mongoose_1.Prop)()];
        _custom_order_id_decorators = [(0, mongoose_1.Prop)({ required: false, unique: true, sparse: true, index: true })];
        __esDecorate(null, null, _school_id_decorators, { kind: "field", name: "school_id", static: false, private: false, access: { has: function (obj) { return "school_id" in obj; }, get: function (obj) { return obj.school_id; }, set: function (obj, value) { obj.school_id = value; } }, metadata: _metadata }, _school_id_initializers, _school_id_extraInitializers);
        __esDecorate(null, null, _trustee_id_decorators, { kind: "field", name: "trustee_id", static: false, private: false, access: { has: function (obj) { return "trustee_id" in obj; }, get: function (obj) { return obj.trustee_id; }, set: function (obj, value) { obj.trustee_id = value; } }, metadata: _metadata }, _trustee_id_initializers, _trustee_id_extraInitializers);
        __esDecorate(null, null, _student_info_decorators, { kind: "field", name: "student_info", static: false, private: false, access: { has: function (obj) { return "student_info" in obj; }, get: function (obj) { return obj.student_info; }, set: function (obj, value) { obj.student_info = value; } }, metadata: _metadata }, _student_info_initializers, _student_info_extraInitializers);
        __esDecorate(null, null, _gateway_name_decorators, { kind: "field", name: "gateway_name", static: false, private: false, access: { has: function (obj) { return "gateway_name" in obj; }, get: function (obj) { return obj.gateway_name; }, set: function (obj, value) { obj.gateway_name = value; } }, metadata: _metadata }, _gateway_name_initializers, _gateway_name_extraInitializers);
        __esDecorate(null, null, _custom_order_id_decorators, { kind: "field", name: "custom_order_id", static: false, private: false, access: { has: function (obj) { return "custom_order_id" in obj; }, get: function (obj) { return obj.custom_order_id; }, set: function (obj, value) { obj.custom_order_id = value; } }, metadata: _metadata }, _custom_order_id_initializers, _custom_order_id_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
}();
exports.Order = Order;
exports.StudentInfoSchema = mongoose_1.SchemaFactory.createForClass(StudentInfo);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
// REMOVE duplicate index declarations — do NOT call OrderSchema.index(...) here
// (If you need compound or special indexes, add them here — just avoid duplicates)
