const createEmailContent = (subject, message) => {
    return `
    <h1>${subject}</h1>
    <p>${message}</p>
  `;
};

module.exports = { createEmailContent };
