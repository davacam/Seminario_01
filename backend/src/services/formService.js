const prisma = require("../config/database");

const ACTIVE_FORM_STATUSES = ["ACTIVE"];

const normalizeFields = (fields) => {
  if (!Array.isArray(fields) || fields.length === 0) {
    throw { statusCode: 400, message: "At least one field is required" };
  }

  return fields.map((field, index) => {
    const type = field.type || "text";
    const key =
      field.key ||
      field.label
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

    if (!field.label || !key) {
      throw {
        statusCode: 400,
        message: `Field ${index + 1} needs a label`,
      };
    }

    if (!["text", "textarea", "number", "date", "select", "checkbox"].includes(type)) {
      throw {
        statusCode: 400,
        message: `Unsupported field type: ${type}`,
      };
    }

    const options =
      type === "select"
        ? (field.options || []).filter(Boolean).map((option) => String(option).trim())
        : [];

    if (type === "select" && options.length === 0) {
      throw {
        statusCode: 400,
        message: `Select field "${field.label}" needs options`,
      };
    }

    return {
      id: field.id || `${key}_${index}`,
      key,
      label: field.label.trim(),
      type,
      required: Boolean(field.required),
      options,
    };
  });
};

const validateResponseData = (fields, data = {}) => {
  const normalizedData = {};

  fields.forEach((field) => {
    const value = data[field.key];

    if (field.required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        throw {
          statusCode: 400,
          message: `Field "${field.label}" is required`,
        };
      }
    }

    if (field.type === "checkbox") {
      normalizedData[field.key] = Boolean(value);
      return;
    }

    if (field.type === "number" && value !== undefined && value !== "") {
      const numberValue = Number(value);
      if (Number.isNaN(numberValue)) {
        throw {
          statusCode: 400,
          message: `Field "${field.label}" must be a number`,
        };
      }
      normalizedData[field.key] = numberValue;
      return;
    }

    normalizedData[field.key] = value ?? "";
  });

  return normalizedData;
};

const getAllForms = async (companyId, filters = {}, skip = 0, take = 50) => {
  const where = { companyId };

  if (filters.status) {
    where.status = filters.status;
  } else {
    where.status = { in: ACTIVE_FORM_STATUSES };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.form.findMany({
    where,
    skip,
    take,
    include: {
      createdBy: { select: { id: true, fullName: true } },
      _count: { select: { responses: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const countForms = async (companyId, filters = {}) => {
  const where = { companyId };
  if (filters.status) where.status = filters.status;
  return prisma.form.count({ where });
};

const getFormById = async (formId, companyId) => {
  return prisma.form.findFirst({
    where: { id: formId, companyId },
    include: {
      createdBy: { select: { id: true, fullName: true } },
      responses: {
        include: {
          user: { select: { id: true, fullName: true } },
          task: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

const createForm = async (companyId, userId, formData) => {
  const fields = normalizeFields(formData.fields);

  return prisma.form.create({
    data: {
      companyId,
      createdById: userId,
      title: formData.title,
      description: formData.description || null,
      isTemplate: Boolean(formData.isTemplate),
      status: formData.status || "ACTIVE",
      fields,
    },
    include: {
      createdBy: { select: { id: true, fullName: true } },
      _count: { select: { responses: true } },
    },
  });
};

const updateForm = async (formId, companyId, formData) => {
  const existingForm = await getFormById(formId, companyId);
  if (!existingForm) {
    throw { statusCode: 404, message: "Form not found" };
  }

  return prisma.form.update({
    where: { id: formId },
    data: {
      title: formData.title || undefined,
      description:
        formData.description === undefined ? undefined : formData.description || null,
      isTemplate:
        formData.isTemplate === undefined ? undefined : Boolean(formData.isTemplate),
      status: formData.status || undefined,
      fields: formData.fields ? normalizeFields(formData.fields) : undefined,
    },
    include: {
      createdBy: { select: { id: true, fullName: true } },
      _count: { select: { responses: true } },
    },
  });
};

const archiveForm = async (formId, companyId) => {
  const existingForm = await getFormById(formId, companyId);
  if (!existingForm) {
    throw { statusCode: 404, message: "Form not found" };
  }

  return prisma.form.update({
    where: { id: formId },
    data: { status: "ARCHIVED" },
  });
};

const submitFormResponse = async (formId, companyId, userId, responseData) => {
  const form = await getFormById(formId, companyId);
  if (!form || form.status !== "ACTIVE") {
    throw { statusCode: 404, message: "Active form not found" };
  }

  if (responseData.taskId) {
    const task = await prisma.task.findFirst({
      where: { id: responseData.taskId, companyId },
      select: { id: true },
    });

    if (!task) {
      throw { statusCode: 404, message: "Task not found" };
    }
  }

  const data = validateResponseData(form.fields, responseData.data);

  return prisma.formResponse.create({
    data: {
      formId,
      taskId: responseData.taskId || null,
      userId,
      data,
      status: responseData.status || "SUBMITTED",
      submittedAt: new Date(),
    },
    include: {
      form: { select: { id: true, title: true } },
      user: { select: { id: true, fullName: true } },
      task: { select: { id: true, title: true } },
    },
  });
};

module.exports = {
  getAllForms,
  countForms,
  getFormById,
  createForm,
  updateForm,
  archiveForm,
  submitFormResponse,
};
