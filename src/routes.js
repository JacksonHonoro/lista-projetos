import { Router } from 'express';

const routes = new Router();

const projects = [
  {
    id: '1',
    title: 'Novo projeto',
    tasks: [],
  },
];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((p) => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not exists' });
  }

  return next();
}

function logRequest(req, res, next) {
  console.count('número de requesições');

  return next();
}

routes.use(logRequest);

// CRIA UM PROJETO
routes.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  return res.json(project);
});

// LISTA TODOS PROJETOS
routes.get('/projects', (req, res) => res.json(projects));

// ALTERA O TITULO DO PROJETO PASSANDO O ID DO PROJETO NA ROTA
routes.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find((p) => p.id == id);

  project.title = title;

  return res.json(project);
});

// DELETA UM PROJETO PELO ID DO PROJETO NA ROTA
routes.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((p) => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send(`Projeto de ID: ${id} deletado!`);
});

// CRIA UMA TAREFA PARA O ID SELECIONADO NA ROTA
routes.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find((p) => p.id == id);

  project.tasks.push(task);

  return res.json(project);
});

export default routes;
