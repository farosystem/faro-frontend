interface ListSectionProps {
  title: any;
  items?: any[];
  label?: any;
  icon?: string;
  emptyMessage?: string;
  showExtra?: boolean;
  showAmount?: boolean;
  withoutm?: boolean;
}

const ListSection = ({
  title,
  items = [],
  label = '•',
  icon = '',
  emptyMessage = 'Sin datos',
  showExtra = false,
  showAmount = false,
  withoutm = false
}: ListSectionProps) => (
  <label className={`${!withoutm ? 'ms-4 ' : ''}fs-5 m-0 label_package_color`}>
    <strong className={`${icon} me-1 span_package_color`} />
    {title ? <strong className="fs-5">{title}: </strong> : null}
    {items.length ? (
      <div>
        {items.map((item, index) => (
          <div
            id={`data${index}`}
            key={`data${index}`}
            className={`${!withoutm ? 'ms-4 ' : ''}col-md-12`}
          >
            <span
              id={`list${item?.nombre || index}${index}`}
              key={`list${item?.nombre || index}${index}`}
              className="fs-5 span_package_color"
            >
              {label ? (label === '•' ? label : `${label}: `) : ''}
              <span
                id={`name${item?.nombre || index}`}
                key={`name${item?.nombre || index}`}
                className="label_package_color "
              >
                {item?.nombre ||
                  item?.numeroHabitacion ||
                  item?.email ||
                  item?.telefono ||
                  'Sin información'}
                {item?.days && <span className=" span_package_color"> x{item?.days}</span>}
              </span>
              {showAmount && (
                <span
                  id={`amount${item?.nombre || index}`}
                  key={`amount${item?.nombre || index}`}
                  className="span_package_color"
                >
                  {item?.cantidad !== 0 && item?.cantidad !== undefined && (
                    <span>
                      {' '}
                      x
                      {parseInt(item.cantidad) +
                        parseInt(item.extra !== undefined ? item.extra : 0)}{' '}
                    </span>
                  )}
                </span>
              )}
              {showExtra && (
                <span
                  id={`extra${item?.nombre || index}`}
                  key={`extra${item?.nombre || index}`}
                  className="span_package_color"
                >
                  {item?.extra !== 0 && item?.extra !== undefined && (
                    <span> x{parseInt(item.extra)} </span>
                  )}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <span id="message" key="message" className="fs-5 span_package_color">
        {emptyMessage}
      </span>
    )}
  </label>
);

export default ListSection;
