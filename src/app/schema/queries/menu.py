import graphene
from app.model import Menu
from app.schema.nodes import NestedMenuNode, MenuNode


def resolve_list_menu(self, info, **kwargs):
    output = []
    myMenu = Menu.query.all()

    if len(myMenu) > 0:
        for item in myMenu:
            output.append(item.drilldown_tree())
        return output[0][0]
    else:
        return output


def resolve_get_menu(self, info, **kwargs):
    return MenuNode.get_query(info).filter_by(
        id=kwargs.get('id')
    ).first()
