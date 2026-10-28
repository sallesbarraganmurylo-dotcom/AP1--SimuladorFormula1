// Frontend puro para ApiSimuladorFormula1
// Operações via fetch com URLs relativas (/api/drivers)

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const form = document.getElementById('driver-form');
  const driverIdInput = document.getElementById('driver-id');
  const driverTituloInput = document.getElementById('driver-titulo');
  const driverDisponivelInput = document.getElementById('driver-disponivel');
  const formTitle = document.getElementById('form-title');
  const formModeBadge = document.getElementById('form-mode-badge');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formCancelBtn = document.getElementById('form-cancel-btn');

  const driversTable = document.getElementById('drivers-table');
  const driversList = document.getElementById('drivers-list');
  const driversCount = document.getElementById('drivers-count');
  const emptyState = document.getElementById('empty-state');
  const loadingSpinner = document.getElementById('loading-spinner');
  const refreshBtn = document.getElementById('refresh-btn');

  const alertBox = document.getElementById('alert-box');
  const alertMessage = document.getElementById('alert-message');
  const alertClose = document.getElementById('alert-close');

  let alertTimeout = null;

  // -------------------------------------------------------------
  // Funções de Notificação / Mensagens
  // -------------------------------------------------------------
  function showAlert(message, type = 'error') {
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }

    alertBox.className = `alert-box ${type}`;
    alertMessage.textContent = message;
    alertBox.classList.remove('hidden');

    // Auto fechar alertas de sucesso após 4 segundos
    if (type === 'success') {
      alertTimeout = setTimeout(() => {
        dismissAlert();
      }, 4000);
    }
  }

  function dismissAlert() {
    alertBox.classList.add('hidden');
    if (alertTimeout) {
      clearTimeout(alertTimeout);
      alertTimeout = null;
    }
  }

  alertClose.addEventListener('click', dismissAlert);

  // -------------------------------------------------------------
  // Resetar Formulário para o Modo de Cadastro
  // -------------------------------------------------------------
  function resetForm() {
    driverIdInput.value = '';
    driverTituloInput.value = '';
    driverDisponivelInput.checked = true;

    formTitle.textContent = 'Cadastrar Novo Piloto';
    formModeBadge.textContent = 'Modo Cadastro';
    formModeBadge.className = 'badge badge-create';

    formSubmitBtn.textContent = 'Cadastrar Piloto';
    formCancelBtn.classList.add('hidden');
    driverTituloInput.focus();
  }

  formCancelBtn.addEventListener('click', resetForm);

  // -------------------------------------------------------------
  // Listar Pilotos (GET /api/drivers)
  // -------------------------------------------------------------
  async function loadDrivers() {
    showLoading(true);

    try {
      const response = await fetch('/api/drivers');

      if (!response.ok) {
        throw new Error(`Falha ao obter lista de pilotos (Código ${response.status})`);
      }

      const drivers = await response.json();
      renderDrivers(drivers);
    } catch (err) {
      console.error('Erro ao listar pilotos:', err);
      showAlert(`Erro ao carregar lista de pilotos: ${err.message}`, 'error');
    } finally {
      showLoading(false);
    }
  }

  function showLoading(isLoading) {
    if (isLoading) {
      loadingSpinner.classList.remove('hidden');
    } else {
      loadingSpinner.classList.add('hidden');
    }
  }

  // Renderizar tabela de pilotos
  function renderDrivers(drivers) {
    driversList.innerHTML = '';

    const total = Array.isArray(drivers) ? drivers.length : 0;
    driversCount.textContent = `${total} piloto(s)`;

    if (total === 0) {
      driversTable.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    driversTable.classList.remove('hidden');
    emptyState.classList.add('hidden');

    drivers.forEach(driver => {
      const row = document.createElement('tr');

      // Coluna ID
      const colId = document.createElement('td');
      colId.textContent = `#${driver.id}`;

      // Coluna Titulo / Nome
      const colTitulo = document.createElement('td');
      colTitulo.textContent = driver.titulo;
      colTitulo.style.fontWeight = '500';

      // Coluna Status (Disponível / Indisponível)
      const colStatus = document.createElement('td');
      const statusPill = document.createElement('span');
      statusPill.className = `status-pill ${driver.disponivel ? 'available' : 'unavailable'}`;

      const statusDot = document.createElement('span');
      statusDot.className = 'status-dot';
      statusPill.appendChild(statusDot);

      const statusText = document.createTextNode(driver.disponivel ? 'Disponível' : 'Indisponível');
      statusPill.appendChild(statusText);
      colStatus.appendChild(statusPill);

      // Coluna Ações
      const colActions = document.createElement('td');
      colActions.className = 'text-right';

      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'actions-cell';

      // Botão Editar
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-sm btn-edit';
      editBtn.textContent = 'Editar';
      editBtn.addEventListener('click', () => startEditDriver(driver.id));

      // Botão Excluir
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-sm btn-delete';
      deleteBtn.textContent = 'Excluir';
      deleteBtn.addEventListener('click', () => deleteDriver(driver.id, driver.titulo));

      actionsContainer.appendChild(editBtn);
      actionsContainer.appendChild(deleteBtn);
      colActions.appendChild(actionsContainer);

      row.appendChild(colId);
      row.appendChild(colTitulo);
      row.appendChild(colStatus);
      row.appendChild(colActions);

      driversList.appendChild(row);
    });
  }

  // -------------------------------------------------------------
  // Iniciar Edição (GET /api/drivers/{id})
  // -------------------------------------------------------------
  async function startEditDriver(id) {
    dismissAlert();
    try {
      const response = await fetch(`/api/drivers/${id}`);

      if (response.status === 404) {
        throw new Error(`Piloto com ID ${id} não foi encontrado.`);
      }

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do piloto (Código ${response.status})`);
      }

      const driver = await response.json();

      // Preenche formulário com os dados retornados
      driverIdInput.value = driver.id;
      driverTituloInput.value = driver.titulo;
      driverDisponivelInput.checked = Boolean(driver.disponivel);

      // Atualiza interface para o Modo Edição
      formTitle.textContent = `Editar Piloto #${driver.id}`;
      formModeBadge.textContent = 'Modo Edição';
      formModeBadge.className = 'badge badge-edit';

      formSubmitBtn.textContent = 'Salvar Alterações';
      formCancelBtn.classList.remove('hidden');

      // Rola a tela até o formulário e foca no campo
      driverTituloInput.focus();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      console.error('Erro ao preparar edição:', err);
      showAlert(err.message, 'error');
    }
  }

  // -------------------------------------------------------------
  // Salvar (POST /api/drivers ou PUT /api/drivers/{id})
  // -------------------------------------------------------------
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    dismissAlert();

    const titulo = driverTituloInput.value.trim();
    if (!titulo) {
      showAlert('Por favor, informe o nome do piloto.', 'error');
      driverTituloInput.focus();
      return;
    }

    const id = driverIdInput.value;
    const isEditing = Boolean(id);

    formSubmitBtn.disabled = true;

    try {
      if (isEditing) {
        // PUT /api/drivers/{id}
        const payload = {
          titulo: titulo,
          disponivel: driverDisponivelInput.checked
        };

        const response = await fetch(`/api/drivers/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.status === 404) {
          throw new Error(`Piloto com ID ${id} não foi encontrado na API.`);
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Falha ao atualizar piloto (Código ${response.status})`);
        }

        showAlert(`Piloto "${titulo}" atualizado com sucesso!`, 'success');
        resetForm();
        await loadDrivers();
      } else {
        // POST /api/drivers
        const payload = {
          titulo: titulo
        };

        const response = await fetch('/api/drivers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Falha ao cadastrar piloto (Código ${response.status})`);
        }

        const novoPiloto = await response.json();
        showAlert(`Piloto "${novoPiloto.titulo || titulo}" cadastrado com sucesso!`, 'success');
        resetForm();
        await loadDrivers();
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      showAlert(err.message, 'error');
    } finally {
      formSubmitBtn.disabled = false;
    }
  });

  // -------------------------------------------------------------
  // Excluir Piloto (DELETE /api/drivers/{id})
  // -------------------------------------------------------------
  async function deleteDriver(id, titulo) {
    dismissAlert();

    const confirmed = window.confirm(`Deseja realmente excluir o piloto "${titulo}" (ID: ${id})?`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: 'DELETE'
      });

      if (response.status === 404) {
        throw new Error(`Piloto com ID ${id} não foi encontrado.`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Falha ao excluir piloto (Código ${response.status})`);
      }

      showAlert(`Piloto "${titulo}" excluído com sucesso!`, 'success');

      // Se estávamos editando exatamente este piloto, cancela a edição
      if (driverIdInput.value === String(id)) {
        resetForm();
      }

      await loadDrivers();
    } catch (err) {
      console.error('Erro ao excluir piloto:', err);
      showAlert(err.message, 'error');
    }
  }

  // Botão de recarregar manual
  refreshBtn.addEventListener('click', () => {
    dismissAlert();
    loadDrivers();
  });

  // Carregamento inicial ao abrir a página
  loadDrivers();
});
