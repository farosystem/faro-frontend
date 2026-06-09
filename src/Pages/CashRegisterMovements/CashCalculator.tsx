import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Table,
  Input,
  Row,
  Col,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import { useQuery } from '@apollo/client';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '@/services/FacturasParametrosService';
import { getSimboloMoneda } from '@/helpers/helpers';

const CashCalculator = ({ isOpen, toggle, onConfirm }) => {
  const { data: dataCurrencyTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'currencyTypes' },
    pollInterval: 1000
  });

  const [activeTab, setActiveTab] = useState('1');
  const [operationHistory, setOperationHistory] = useState([]);
  const [currentOperation, setCurrentOperation] = useState({
    display: '0',
    value1: null,
    operator: null,
    waitingForValue2: false
  });

  const initialDenominations = useMemo(() => {
    if (dataCurrencyTypes?.obtenerFacturasParametrosByType) {
      return dataCurrencyTypes.obtenerFacturasParametrosByType.map((currency) => ({
        currencyId: currency.id,
        currency: currency.value,
        items: [{ denomination: '', quantity: '', subtotal: 0 }]
      }));
    }
    return [];
  }, [dataCurrencyTypes]);

  const [denominations, setDenominations] = useState(initialDenominations);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('cashCalculator');
    if (saved && isOpen) {
      const data = JSON.parse(saved);
      setDenominations(data.denominations || initialDenominations);
      setOperationHistory(data.operationHistory || []);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(
        'cashCalculator',
        JSON.stringify({
          denominations,
          operationHistory: operationHistory.slice(0, 3)
        })
      );
    }
  }, [denominations, operationHistory, isOpen]);

  const handleDenominationChange = (currencyId, index, field, value) => {
    setDenominations((prev) =>
      prev.map((currency) => {
        if (currency.currencyId !== currencyId) return currency;

        const updatedItems = [...currency.items];
        updatedItems[index][field] = value;

        const denom = parseFloat(updatedItems[index].denomination) || 0;
        const quant = parseInt(updatedItems[index].quantity) || 0;
        updatedItems[index].subtotal = denom * quant;

        return { ...currency, items: updatedItems };
      })
    );
  };

  const addRow = (currencyId) => {
    setDenominations((prev) =>
      prev.map((currency) => {
        if (currency.currencyId !== currencyId) return currency;
        return {
          ...currency,
          items: [...currency.items, { denomination: '', quantity: '', subtotal: 0 }]
        };
      })
    );
  };

  const removeRow = (currencyId, index) => {
    setDenominations((prev) =>
      prev.map((currency) => {
        if (currency.currencyId !== currencyId) return currency;
        const newItems = [...currency.items];
        newItems.splice(index, 1);
        return {
          ...currency,
          items: newItems.length ? newItems : [{ denomination: '', quantity: '', subtotal: 0 }]
        };
      })
    );
  };

  const calculateCurrencyTotal = (items) =>
    items.reduce((total, item) => total + (parseFloat(item.subtotal) || 0), 0).toFixed(2);

  const handleDecimalPoint = () => {
    const { display } = currentOperation;
    if (!display.includes('.')) {
      setCurrentOperation({
        ...currentOperation,
        display: display + '.'
      });
    }
  };

  const handleOperator = (op) => {
    const { display, value1, operator, waitingForValue2 } = currentOperation;
    const inputValue = parseFloat(display);

    // Cambio de operador antes de escribir segundo número
    if (waitingForValue2) {
      setCurrentOperation((prev) => ({
        ...prev,
        operator: op
      }));
      return;
    }

    // Primer número ingresado
    if (value1 === null) {
      setCurrentOperation({
        display,
        value1: inputValue,
        operator: op,
        waitingForValue2: true
      });
    } else {
      // Calcular con operador anterior
      const result = performCalculation(value1, inputValue, operator);
      setCurrentOperation({
        display: String(result),
        value1: result,
        operator: op,
        waitingForValue2: true
      });

      setOperationHistory((prev) =>
        [{ value1, value2: inputValue, operator, result }, ...prev].slice(0, 3)
      );
    }
  };

  const performCalculation = (val1, val2, op) => {
    switch (op) {
      case '+':
        return val1 + val2;
      case '-':
        return val1 - val2;
      case '*':
        return val1 * val2;
      case '/':
        return val1 / val2;
      default:
        return val2;
    }
  };

  const handleEquals = () => {
    const { display, value1, operator } = currentOperation;
    const inputValue = parseFloat(display);

    if (operator && value1 !== null) {
      const result = performCalculation(value1, inputValue, operator);

      const newOperation = {
        value1,
        value2: inputValue,
        operator,
        result
      };

      setCurrentOperation({
        display: String(result),
        value1: null,
        operator: null,
        waitingForValue2: false
      });

      setOperationHistory((prev) => [newOperation, ...prev].slice(0, 3));
    }
  };

  const handleClear = () => {
    setCurrentOperation({
      display: '0',
      value1: null,
      operator: null,
      waitingForValue2: false
    });
  };

  const handleClearAll = () => {
    handleClear();
    setOperationHistory([]);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Calculadora</ModalHeader>
      <ModalBody>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === '1' ? 'active' : ''}
              onClick={() => setActiveTab('1')}
            >
              Denominaciones
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '2' ? 'active' : ''}
              onClick={() => setActiveTab('2')}
            >
              Calculadora Matemática
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} className="mt-3">
          <TabPane tabId="1">
            {denominations.map((currency, idx) => (
              <div key={currency.currencyId} className="mb-4">
                <h5 className="mb-2">{currency.currency}</h5>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Denominación</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currency.items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <Input
                            type="number"
                            value={item.denomination}
                            onChange={(e) =>
                              handleDenominationChange(
                                currency.currencyId,
                                i,
                                'denomination',
                                e.target.value
                              )
                            }
                            placeholder="Ej: 100"
                            min="0"
                            step="0.01"
                            invalid={!!errors[`${currency.currencyId}-${i}-denomination`]}
                          />
                          {errors[`${currency.currencyId}-${i}-denomination`] && (
                            <FormFeedback>
                              {errors[`${currency.currencyId}-${i}-denomination`]}
                            </FormFeedback>
                          )}
                        </td>
                        <td>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleDenominationChange(
                                currency.currencyId,
                                i,
                                'quantity',
                                e.target.value
                              )
                            }
                            placeholder="Ej: 2"
                            min="0"
                            invalid={!!errors[`${currency.currencyId}-${i}-quantity`]}
                          />
                          {errors[`${currency.currencyId}-${i}-quantity`] && (
                            <FormFeedback>
                              {errors[`${currency.currencyId}-${i}-quantity`]}
                            </FormFeedback>
                          )}
                        </td>
                        <td>{getSimboloMoneda(currency.currency) + '' + (item.subtotal || 0)}</td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => removeRow(currency.currencyId, i)}
                            disabled={currency.items.length <= 1}
                          >
                            ×
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Row className="mb-3">
                  <Col>
                    <Button color="link" size="sm" onClick={() => addRow(currency.currencyId)}>
                      + Añadir denominación
                    </Button>
                  </Col>
                  <Col className="text-end">
                    <strong>
                      Total:{' '}
                      {getSimboloMoneda(currency.currency) +
                        '' +
                        calculateCurrencyTotal(currency.items)}
                    </strong>
                  </Col>
                </Row>
              </div>
            ))}
          </TabPane>
          <TabPane tabId="2">
            <div className="p-4 bg-light rounded">
              <Input
                type="text"
                className="form-control form-control-lg text-end mb-3 fs-2 py-4"
                inputMode="decimal"
                pattern="[0-9.]*"
                value={currentOperation.display}
                onClick={() => {
                  if (currentOperation.waitingForValue2) {
                    setCurrentOperation((prev) => ({
                      ...prev,
                      display: '0',
                      waitingForValue2: false
                    }));
                  }
                }}
                onFocus={() => {
                  if (currentOperation.waitingForValue2) {
                    setCurrentOperation((prev) => ({
                      ...prev,
                      display: '0',
                      waitingForValue2: false
                    }));
                  }
                }}
                onChange={(e) => {
                  const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');
                  setCurrentOperation((prev) => ({
                    ...prev,
                    display: sanitizedValue
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEquals();
                  if (
                    e.key.length === 1 &&
                    !/[0-9.]/.test(e.key) &&
                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Ingresa un número"
              />
              <Row className="mb-3">
                <Col xs="6">
                  <Button block className="fs-4" color="secondary" onClick={handleClear}>
                    C
                  </Button>
                </Col>
                <Col xs="6">
                  <Button block className="fs-4" color="danger" onClick={handleClearAll}>
                    AC
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="3">
                  <Button
                    block
                    color="info"
                    size="sm"
                    className="py-3 fs-2"
                    onClick={() => handleOperator('/')}
                  >
                    ÷
                  </Button>
                </Col>
                <Col xs="3">
                  <Button
                    block
                    color="info"
                    size="sm"
                    className="py-3 fs-2"
                    onClick={() => handleOperator('*')}
                  >
                    ×
                  </Button>
                </Col>
                <Col xs="3">
                  <Button
                    block
                    color="info"
                    size="sm"
                    className="py-3 fs-2"
                    onClick={() => handleOperator('-')}
                  >
                    −
                  </Button>
                </Col>
                <Col xs="3">
                  <Button
                    block
                    color="info"
                    size="sm"
                    className="py-3 fs-2"
                    onClick={() => handleOperator('+')}
                  >
                    +
                  </Button>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs="6">
                  <Button block className="fs-4" onClick={handleDecimalPoint}>
                    .
                  </Button>
                </Col>
                <Col xs="6">
                  <Button block className="fs-4" color="success" onClick={handleEquals}>
                    =
                  </Button>
                </Col>
              </Row>

              <h5 className="mt-4">Operaciones Recientes (Últimas 3)</h5>
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Operación</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {operationHistory.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted">
                        No se registraron operaciones
                      </td>
                    </tr>
                  ) : (
                    operationHistory.map((op, index) => (
                      <tr key={index}>
                        <td>
                          {op.value1} {op.operator} {op.value2}
                        </td>
                        <td>
                          <strong>{op.result}</strong>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  );
};

export default CashCalculator;
