export const Element = ({ props }) => {
  return (
    <tr className="border-b border-slate-200">
      <td className="p-4 text-left">
        <input
          type="checkbox"
          className="mr-6"
          checked={props.isChecked}
          onChange={props.toggleSelectRecord}
        />
        {props.recordId}
      </td>
      <td className="p-4 text-left">{props.source}</td>
      <td className="p-4 text-left">{props.listName}</td>
      <td className="p-4 text-left">{props.type}</td>
      <td className="p-4 text-left">{props.action}</td>
      <td className="p-4 text-left">{props.name}</td>
      <td className="p-4 text-left">{props.createdBy}</td>
      <td className="p-4 text-left">{props.claimedBy}</td>
    </tr>
  );
};
